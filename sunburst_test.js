"use strict";
// import { formatType, handleErrors } from '../common/utils'
// import {
//   Link,
//   Looker,
//   LookerChartUtils,
//   Row,
//   VisConfig,
//   VisualizationDefinition
// } from '../types/types'
var formatType = function (valueFormat) {
    if (!valueFormat)
        return undefined;
    var format = '';
    switch (valueFormat.charAt(0)) {
        case '$':
            format += '$';
            break;
        case 'Â£':
            format += 'Â£';
            break;
        case 'â‚¬':
            format += 'â‚¬';
            break;
    }
    if (valueFormat.indexOf(',') > -1) {
        format += ',';
    }
    var splitValueFormat = valueFormat.split('.');
    format += '.';
    format += splitValueFormat.length > 1 ? splitValueFormat[1].length : 0;
    switch (valueFormat.slice(-1)) {
        case '%':
            format += '%';
            break;
        case '0':
            format += 'f';
            break;
    }
    return d3.format(format);
};
var handleErrors = function (vis, res, options) {
    var check = function (group, noun, count, min, max) {
        if (!vis.addError || !vis.clearErrors)
            return false;
        if (count < min) {
            vis.addError({
                title: "Not Enough " + noun + "s",
                message: "This visualization requires " + (min === max ? 'exactly' : 'at least') + " " + min + " " + noun.toLowerCase() + (min === 1 ? '' : 's') + ".",
                group: group
            });
            return false;
        }
        if (count > max) {
            vis.addError({
                title: "Too Many " + noun + "s",
                message: "This visualization requires " + (min === max ? 'exactly' : 'no more than') + " " + max + " " + noun.toLowerCase() + (min === 1 ? '' : 's') + ".",
                group: group
            });
            return false;
        }
        vis.clearErrors(group);
        return true;
    };
    var _a = res.fields, pivots = _a.pivots, dimensions = _a.dimensions, measures = _a.measure_like;
    return (check('pivot-req', 'Pivot', pivots.length, options.min_pivots, options.max_pivots)
        && check('dim-req', 'Dimension', dimensions.length, options.min_dimensions, options.max_dimensions)
        && check('mes-req', 'Measure', measures.length, options.min_measures, options.max_measures));
};
var colorBy = {
    NODE: 'node',
    ROOT: 'root'
};
// recursively create children array
function descend(obj, depth) {
    if (depth === void 0) { depth = 0; }
    var arr = [];
    for (var k in obj) {
        if (k === '__data') {
            continue;
        }
        var child = {
            name: k,
            depth: depth,
            children: descend(obj[k], depth + 1)
        };
        if ('__data' in obj[k]) {
            child.data = obj[k].__data;
            child.links = obj[k].__data.taxonomy.links;
        }
        arr.push(child);
    }
    return arr;
}
function burrow(table, config) {
    // create nested object
    var obj = {};
    table.forEach(function (row) {
        // start at root
        var layer = obj;
        // create children as nested objects
        row.taxonomy.value.forEach(function (key) {
            if (key === null && !config.show_null_points) {
                return;
            }
            layer[key] = key in layer ? layer[key] : {};
            layer = layer[key];
        });
        layer.__data = row;
    });
    // use descend to create nested children arrays
    return {
        name: 'root',
        children: descend(obj, 1),
        depth: 0
    };
}
var getLinksFromRow = function (row) {
    return Object.keys(row).reduce(function (links, datum) {
        if (row[datum].links) {
            var datumLinks = row[datum].links;
            return links.concat(datumLinks);
        }
        else {
            return links;
        }
    }, []);
};
var vis = {
    id: 'sunburst',
    label: 'Sunburst',
    options: {
        color_range: {
            type: 'array',
            label: 'Color Range',
            display: 'colors',
            "default": ['#dd3333', '#80ce5d', '#f78131', '#369dc1', '#c572d3', '#36c1b3', '#b57052', '#ed69af']
        },
        color_by: {
            type: 'string',
            label: 'Color By',
            display: 'select',
            values: [
                { 'Color By Root': colorBy.ROOT },
                { 'Color By Node': colorBy.NODE }
            ],
            "default": colorBy.ROOT
        },
        show_null_points: {
            type: 'boolean',
            label: 'Plot Null Values',
            "default": true
        }
    },
    // Set up the initial state of the visualization
    create: function (element, _config) {
        element.style.fontFamily = "\"Open Sans\", \"Helvetica\", sans-serif";
        this.svg = d3.select(element).append('svg');
    },
    // Render in response to the data or settings changing
    update: function (data, element, config, queryResponse) {
        if (!handleErrors(this, queryResponse, {
            min_pivots: 0, max_pivots: 0,
            min_dimensions: 1, max_dimensions: undefined,
            min_measures: 1, max_measures: 1
        }))
            return;
        var width = element.clientWidth;
        var height = element.clientHeight;
        var radius = Math.min(width, height) / 2 - 8;
        var dimensions = queryResponse.fields.dimension_like;
        var measure = queryResponse.fields.measure_like[0];
        var format = formatType(measure.value_format) || (function (s) { return s.toString(); });
        var colorScale = d3.scaleOrdinal();
        var color = colorScale.range(config.color_range || []);
        data.forEach(function (row) {
            row.taxonomy = {
                links: getLinksFromRow(row),
                value: dimensions.map(function (dimension) { return row[dimension.name].value; })
            };
        });
        var partition = d3.partition().size([2 * Math.PI, radius * radius]);
        var arc = (d3.arc()
            .startAngle(function (d) { return d.x0; })
            .endAngle(function (d) { return d.x1; })
            .innerRadius(function (d) { return Math.sqrt(d.y0); })
            .outerRadius(function (d) { return Math.sqrt(d.y1); }));
        var svg = (this.svg
            .html('')
            .attr('width', '100%')
            .attr('height', '100%')
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')'));
        var label = svg.append('text').attr('y', -height / 2 + 20).attr('x', -width / 2 + 20);
        var root = d3.hierarchy(burrow(data, config)).sum(function (d) {
            return 'data' in d ? d.data[measure.name].value : 0;
        });
        partition(root);
        svg
            .selectAll('path')
            .data(root.descendants())
            .enter()
            .append('path')
            .attr('d', arc)
            .style('fill', function (d) {
            if (d.depth === 0)
                return 'none';
            if (config.color_by === colorBy.NODE) {
                return color(d.data.name);
            }
            else {
                return color(d.ancestors().map(function (p) { return p.data.name; }).slice(-2, -1));
            }
        })
            .style('fill-opacity', function (d) { return 1 - d.depth * 0.15; })
            .style('transition', function (d) { return 'fill-opacity 0.5s'; })
            .style('stroke', function (d) { return '#fff'; })
            .style('stroke-width', function (d) { return '0.5px'; })
            .on('click', function (d) {
            var event = { pageX: d3.event.pageX, pageY: d3.event.pageY };
            LookerCharts.Utils.openDrillMenu({
                links: d.data.links,
                event: event
            });
        })
            .on('mouseenter', function (d) {
            var ancestorText = (d.ancestors()
                .map(function (p) { return p.data.name; })
                .slice(0, -1)
                .reverse()
                .join('-'));
            label.text(ancestorText + ": " + format(d.value));
            var ancestors = d.ancestors();
            svg
                .selectAll('path')
                .style('fill-opacity', function (p) {
                return ancestors.indexOf(p) > -1 ? 1 : 0.15;
            });
        })
            .on('mouseleave', function (d) {
            label.text('');
            svg
                .selectAll('path')
                .style('fill-opacity', function (d) { return 1 - d.depth * 0.15; });
        });
    }
};
looker.plugins.visualizations.add(vis);
