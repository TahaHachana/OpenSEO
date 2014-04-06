declare module IntelliFactory {
    module WebSharper {
        module Google {
            module Visualization {
                module Base {
                    interface ColumnType {
                    }
                    interface Cell {
                    }
                    interface ColumnRole {
                    }
                    interface ColumnDescription {
                    }
                    interface SortType {
                    }
                    interface DataCommon {
                    }
                    interface ChartLayoutInterface {
                    }
                    interface ChartOptionsCommon {
                    }
                    interface ChartCommon<_T1> {
                    }
                }
                module Formatters {
                    interface Formatter {
                    }
                    interface ArrowFormatOptions {
                    }
                    interface BarFormatOptions {
                    }
                    interface DateFormatOptions {
                    }
                    interface NumberFormatOptions {
                    }
                }
                module Events {
                    module AreaChart {
                        var Ready : {
                            (visualization: __ABBREV.__visualization.AreaChart): any;
                        };
                        var Select : {
                            (visualization: __ABBREV.__visualization.AreaChart): any;
                        };
                        var OnMouseOver : {
                            (visualization: __ABBREV.__visualization.AreaChart): any;
                        };
                        var OnMouseOut : {
                            (visualization: __ABBREV.__visualization.AreaChart): any;
                        };
                    }
                    module BarChart {
                        var Ready : {
                            (visualization: __ABBREV.__visualization.BarChart): any;
                        };
                        var Select : {
                            (visualization: __ABBREV.__visualization.BarChart): any;
                        };
                        var OnMouseOver : {
                            (visualization: __ABBREV.__visualization.BarChart): any;
                        };
                        var OnMouseOut : {
                            (visualization: __ABBREV.__visualization.BarChart): any;
                        };
                    }
                    module ColumnChart {
                        var Ready : {
                            (visualization: __ABBREV.__visualization.ColumnChart): any;
                        };
                        var Select : {
                            (visualization: __ABBREV.__visualization.ColumnChart): any;
                        };
                        var OnMouseOver : {
                            (visualization: __ABBREV.__visualization.ColumnChart): any;
                        };
                        var OnMouseOut : {
                            (visualization: __ABBREV.__visualization.ColumnChart): any;
                        };
                    }
                    module LineChart {
                        var Ready : {
                            (visualization: __ABBREV.__visualization.LineChart): any;
                        };
                        var Select : {
                            (visualization: __ABBREV.__visualization.LineChart): any;
                        };
                        var OnMouseOver : {
                            (visualization: __ABBREV.__visualization.LineChart): any;
                        };
                        var OnMouseOut : {
                            (visualization: __ABBREV.__visualization.LineChart): any;
                        };
                    }
                    module PieChart {
                        var Ready : {
                            (visualization: __ABBREV.__visualization.PieChart): any;
                        };
                        var Select : {
                            (visualization: __ABBREV.__visualization.PieChart): any;
                        };
                        var OnMouseOver : {
                            (visualization: __ABBREV.__visualization.PieChart): any;
                        };
                        var OnMouseOut : {
                            (visualization: __ABBREV.__visualization.PieChart): any;
                        };
                    }
                    module ScatterChart {
                        var Ready : {
                            (visualization: __ABBREV.__visualization.ScatterChart): any;
                        };
                        var Select : {
                            (visualization: __ABBREV.__visualization.ScatterChart): any;
                        };
                        var OnMouseOver : {
                            (visualization: __ABBREV.__visualization.ScatterChart): any;
                        };
                        var OnMouseOut : {
                            (visualization: __ABBREV.__visualization.ScatterChart): any;
                        };
                    }
                    module IntensityMap {
                        var Select : {
                            (visualization: __ABBREV.__visualization.IntensityMap): any;
                        };
                        var Ready : {
                            (visualization: __ABBREV.__visualization.IntensityMap): any;
                        };
                    }
                    module MotionChart {
                        var Ready : {
                            (visualization: __ABBREV.__visualization.MotionChart): any;
                        };
                        var StateChange : {
                            (visualization: __ABBREV.__visualization.MotionChart): any;
                        };
                    }
                    module OrgChart {
                        var Collapse : {
                            (visualization: __ABBREV.__visualization.OrgChart): any;
                        };
                        var OnMouseOver : {
                            (visualization: __ABBREV.__visualization.OrgChart): any;
                        };
                        var OnMouseOut : {
                            (visualization: __ABBREV.__visualization.OrgChart): any;
                        };
                        var Select : {
                            (visualization: __ABBREV.__visualization.OrgChart): any;
                        };
                        var Ready : {
                            (visualization: __ABBREV.__visualization.OrgChart): any;
                        };
                    }
                    module Table {
                        var Ready : {
                            (visualization: __ABBREV.__visualization.Table): any;
                        };
                        var Select : {
                            (visualization: __ABBREV.__visualization.Table): any;
                        };
                        var Page : {
                            (visualization: __ABBREV.__visualization.Table): any;
                        };
                        var Sort : {
                            (visualization: __ABBREV.__visualization.Table): any;
                        };
                    }
                    module TreeMap {
                        var Ready : {
                            (visualization: __ABBREV.__visualization.TreeMap): any;
                        };
                        var Select : {
                            (visualization: __ABBREV.__visualization.TreeMap): any;
                        };
                        var OnMouseOver : {
                            (visualization: __ABBREV.__visualization.TreeMap): any;
                        };
                        var OnMouseOut : {
                            (visualization: __ABBREV.__visualization.TreeMap): any;
                        };
                    }
                    interface RowColumnIndexes {
                        row: number;
                        column: number;
                    }
                    interface AreaChart {
                    }
                    interface BarChart {
                    }
                    interface ColumnChart {
                    }
                    interface LineChart {
                    }
                    interface PieChart {
                    }
                    interface ScatterChart {
                    }
                    interface RegionClickArgs {
                        region: string;
                    }
                    interface IntensityMap {
                    }
                    interface MotionChart {
                    }
                    interface CollapseEventArgs {
                        collapsed: boolean;
                        row: number;
                    }
                    interface Row {
                        row: number;
                    }
                    interface OrgChart {
                    }
                    interface PageArgs {
                        page: number;
                    }
                    interface SortArgs {
                        column: number;
                        ascending: boolean;
                        sortedIndexes: number[];
                    }
                    interface Table {
                    }
                    interface TreeMap {
                    }
                    var event : {
                        <_M1>(target: __ABBREV.__WebSharper.ObjectProxy, eventName: string): any;
                    };
                }
                module Enumerations {
                    interface PieChartLegendPosition {
                    }
                }
                module Dependencies {
                    interface Visualization {
                    }
                    interface BaseResourceDefinition {
                    }
                    interface Table {
                    }
                    interface Timeline {
                    }
                    interface AreaChart {
                    }
                    interface Gauge {
                    }
                    interface CoreChart {
                    }
                    interface GeoChart {
                    }
                    interface IntensityMap {
                    }
                    interface MotionChart {
                    }
                    interface OrgChart {
                    }
                    interface TreeMap {
                    }
                }
                interface BoundingBox {
                }
                interface TextStyle {
                }
                interface Axis {
                }
                interface Selection {
                    row: number;
                    column: number;
                }
                interface AggregationTarget {
                }
                interface Easing {
                }
                interface Animation {
                }
                interface TitlePosition {
                }
                interface Color {
                }
                interface FocusTarget {
                }
                interface LegendPosition {
                }
                interface LegendAlignment {
                }
                interface Legend {
                }
                interface SelectionMode {
                }
                interface Series {
                }
                interface TooltipTrigger {
                }
                interface Tooltip {
                }
                interface TrendlineType {
                }
                interface Trendline {
                }
                interface TableCSSClasses {
                }
                interface EnableMode {
                }
                interface TableOptions {
                }
                interface SortInfo {
                    column: number;
                    ascending: boolean;
                    sortedIndexes: number[];
                }
                interface QuerySendMethod {
                }
                interface QueryOptions {
                }
                interface QueryErrorReason {
                }
                interface AreaChartOptions {
                }
                interface Bar {
                }
                interface BarChartOptions {
                }
                interface ColorAxisLegend {
                }
                interface BubbleColorAxis {
                }
                interface Bubble {
                }
                interface SizeAxis {
                }
                interface BubbleChartOptions {
                }
                interface Candlestick {
                }
                interface CandlestickChartOptions {
                }
                interface ColumnChartOptions {
                }
                interface CurveType {
                }
                interface LineChartOptions {
                }
                interface SeriesType {
                }
                interface ComboChartOptions {
                }
                interface GaugeOptions {
                }
                interface Region {
                }
                interface GeoChartDisplayMode {
                }
                interface GeoChartColorAxis {
                }
                interface MagnifyingGlass {
                }
                interface GeoChartResolution {
                }
                interface GeoChartOptions {
                }
                interface IMRegion {
                }
                interface IntensityMapOptions {
                }
                interface MotionChartOptions {
                }
                interface OrgChartSize {
                }
                interface OrgChartOptions {
                }
                interface PieSliceText {
                }
                interface PieSlice {
                }
                interface PieChartOptions {
                }
                interface ScatterChartOptions {
                }
                interface SteppedAreaChartOptions {
                }
                interface Timeline_ {
                }
                interface TimelineOptions {
                }
                interface TreeMapOptions {
                }
            }
        }
    }
}
declare module google {
    module visualization {
        interface DataTable {
        }
        interface DataView {
        }
        interface Table {
        }
        interface QueryResponse {
        }
        interface Query {
        }
        interface AreaChart {
        }
        interface BarChart {
        }
        interface BubbleChart {
        }
        interface CandlestickChart {
        }
        interface ColumnChart {
        }
        interface LineChart {
        }
        interface ComboChart {
        }
        interface ArrowFormat {
        }
        interface BarFormat {
        }
        interface ColorFormat {
        }
        interface DateFormat {
        }
        interface NumberFormat {
        }
        interface PatternFormat {
        }
        interface Gauge {
        }
        interface GeoChart {
        }
        interface IntensityMap {
        }
        interface MotionChart {
        }
        interface OrgChart {
        }
        interface PieChart {
        }
        interface ScatterChart {
        }
        interface SteppedAreaChart {
        }
        interface Timeline {
        }
        interface TreeMap {
        }
    }
}
declare module __ABBREV {
    
    export import __visualization = google.visualization;
    export import __WebSharper = IntelliFactory.WebSharper;
}
