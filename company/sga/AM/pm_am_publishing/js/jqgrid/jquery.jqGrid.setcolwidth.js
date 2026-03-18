   $.jgrid.extend({
            setColWidth: function (iCol, newWidth, adjustGridWidth) {
                "use strict";
                return this.each(function () {
                    var $self = $(this), grid = this.grid, colName, colModel, i, nCol;
                    if (typeof iCol === "string") {
                        // the first parametrer is column name instead of index
                        colName = iCol;
                        colModel = $self.jqGrid("getGridParam", "colModel");
                        for (i = 0, nCol = colModel.length; i < nCol; i++) {
                            if (colModel[i].name === colName) {
                                iCol = i;
                                break;
                            }
                        }
                        if (i >= nCol) {
                            return; // error: non-existing column name specified as the first parameter
                        }
                    } else if (typeof iCol !== "number") {
                        return; // error: wrong parameters
                    }
                    grid.resizing = { idx: iCol };
                    grid.headers[iCol].newWidth = newWidth;
                    if (adjustGridWidth !== false) {
                        grid.newWidth = grid.width + newWidth - grid.headers[iCol].width;
                    }
                    grid.dragEnd();   // adjust column width
                    if (adjustGridWidth !== false) {
                        $self.jqGrid("setGridWidth", grid.newWidth, false); // adjust grid width too
                    }
                });
            }
        });