// ==========================================
// Utilidades para exportación desde el cliente (frontend)
// ==========================================
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// ==========================================
// Utilidades de formateo
// ==========================================
var formatCurrency = function (amount) {
    var numAmount = parseFloat(amount.replace(/,/g, ''));
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numAmount);
};
var formatDate = function (dateString) {
    return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
var getReportTitle = function (reportType) {
    var titles = {
        'balance_general': 'Balance General',
        'p_g': 'Estado de Pérdidas y Ganancias',
        'flujo_efectivo': 'Estado de Flujo de Efectivo',
        'balance_comprobacion': 'Balance de Comprobación'
    };
    return titles[reportType] || 'Reporte Financiero';
};
// ==========================================
// Utilidades de descarga
// ==========================================
var downloadBlob = function (blob, filename) {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
var generateFilename = function (reportType, format, date) {
    var dateStr = date || new Date().toISOString().split('T')[0];
    var typeNames = {
        'balance_general': 'balance-general',
        'p_g': 'perdidas-ganancias',
        'flujo_efectivo': 'flujo-efectivo',
        'balance_comprobacion': 'balance-comprobacion'
    };
    var typeName = typeNames[reportType] || reportType;
    return "".concat(typeName, "-").concat(dateStr, ".").concat(format);
};
// ==========================================
// Exportación a CSV
// ==========================================
export var exportToCSV = function (report, options) {
    if (options === void 0) { options = {}; }
    var lines = [];
    // Metadatos del reporte
    if (options.includeMetadata !== false) {
        lines.push("\"".concat(getReportTitle(report.report_type), "\""));
        lines.push("\"Empresa: ".concat(report.project_context, "\""));
        lines.push("\"Per\u00EDodo: ".concat(formatDate(report.period.from_date), " - ").concat(formatDate(report.period.to_date), "\""));
        lines.push("\"Generado: ".concat(formatDate(report.generated_at), "\""));
        lines.push('');
    }
    // Secciones del reporte
    if (report.table && report.table.sections) {
        report.table.sections.forEach(function (section) {
            lines.push("\"".concat(section.section_name, "\""));
            lines.push('"Código","Cuenta","Saldo Inicial","Movimientos","Saldo Final"');
            var flattenedItems = flattenAccountItems(section.items || []);
            flattenedItems.forEach(function (item) {
                var indent = '  '.repeat(item.level || 0);
                lines.push("\"".concat(item.account_code, "\",\"").concat(indent).concat(item.account_name, "\",\"").concat(item.opening_balance, "\",\"").concat(item.movements, "\",\"").concat(item.closing_balance, "\""));
            });
            if (section.total) {
                lines.push("\"\",\"TOTAL ".concat(section.section_name, "\",\"\",\"\",\"").concat(section.total, "\""));
            }
            lines.push('');
        });
    }
    // Totales generales
    if (report.table && report.table.totals && Object.keys(report.table.totals).length > 0) {
        lines.push('"RESUMEN GENERAL"');
        Object.entries(report.table.totals).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            var label = key.replace(/_/g, ' ').toUpperCase();
            lines.push("\"".concat(label, "\",\"").concat(value, "\""));
        });
        lines.push('');
    }
    // Narrativa (opcional)
    if (options.includeNarrative && report.narrative) {
        lines.push('"ANÁLISIS DEL REPORTE"');
        lines.push('');
        if (report.narrative.executive_summary) {
            lines.push('"Resumen Ejecutivo"');
            lines.push("\"".concat(report.narrative.executive_summary, "\""));
            lines.push('');
        }
        if (report.narrative.key_insights && report.narrative.key_insights.length > 0) {
            lines.push('"Insights Clave"');
            report.narrative.key_insights.forEach(function (insight) {
                lines.push("\"\u2022 ".concat(insight, "\""));
            });
            lines.push('');
        }
        if (report.narrative.recommendations && report.narrative.recommendations.length > 0) {
            lines.push('"Recomendaciones"');
            report.narrative.recommendations.forEach(function (recommendation) {
                lines.push("\"\u2192 ".concat(recommendation, "\""));
            });
            lines.push('');
        }
    }
    var csvContent = lines.join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var filename = options.customFilename || generateFilename(report.report_type, 'csv');
    downloadBlob(blob, filename);
};
// ==========================================
// Exportación a Excel (XLSX)
// ==========================================
export var exportToExcel = function (report_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([report_1], args_1, true), void 0, function (report, options) {
        var XLSX, workbook, worksheetData, worksheet, columnWidths, narrativeData_1, narrativeWorksheet, filename;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, import('xlsx')];
                case 1:
                    XLSX = _a.sent();
                    workbook = XLSX.utils.book_new();
                    worksheetData = [];
                    // Metadatos
                    if (options.includeMetadata !== false) {
                        worksheetData.push([getReportTitle(report.report_type)]);
                        worksheetData.push(["Empresa: ".concat(report.project_context)]);
                        worksheetData.push(["Per\u00EDodo: ".concat(formatDate(report.period.from_date), " - ").concat(formatDate(report.period.to_date))]);
                        worksheetData.push(["Generado: ".concat(formatDate(report.generated_at))]);
                        worksheetData.push([]);
                    }
                    // Secciones del reporte
                    if (report.table && report.table.sections) {
                        report.table.sections.forEach(function (section) {
                            worksheetData.push([section.section_name]);
                            worksheetData.push(['Código', 'Cuenta', 'Saldo Inicial', 'Movimientos', 'Saldo Final']);
                            var flattenedItems = flattenAccountItems(section.items || []);
                            flattenedItems.forEach(function (item) {
                                var indent = '  '.repeat(item.level || 0);
                                worksheetData.push([
                                    item.account_code,
                                    indent + item.account_name,
                                    parseFloat(item.opening_balance.replace(/,/g, '')) || 0,
                                    parseFloat(item.movements.replace(/,/g, '')) || 0,
                                    parseFloat(item.closing_balance.replace(/,/g, '')) || 0
                                ]);
                            });
                            if (section.total) {
                                worksheetData.push([
                                    '',
                                    "TOTAL ".concat(section.section_name),
                                    '',
                                    '',
                                    parseFloat(section.total.replace(/,/g, '')) || 0
                                ]);
                            }
                            worksheetData.push([]);
                        });
                    }
                    // Totales generales
                    if (report.table && report.table.totals && Object.keys(report.table.totals).length > 0) {
                        worksheetData.push(['RESUMEN GENERAL']);
                        Object.entries(report.table.totals).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            var label = key.replace(/_/g, ' ').toUpperCase();
                            worksheetData.push([label, parseFloat(value.replace(/,/g, '')) || 0]);
                        });
                        worksheetData.push([]);
                    }
                    worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
                    columnWidths = [
                        { wch: 15 }, // Código
                        { wch: 40 }, // Cuenta
                        { wch: 15 }, // Saldo Inicial
                        { wch: 15 }, // Movimientos
                        { wch: 15 } // Saldo Final
                    ];
                    worksheet['!cols'] = columnWidths;
                    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
                    // Hoja de narrativa (si se incluye)
                    if (options.includeNarrative && report.narrative) {
                        narrativeData_1 = [];
                        narrativeData_1.push(['ANÁLISIS DEL REPORTE']);
                        narrativeData_1.push([]);
                        if (report.narrative.executive_summary) {
                            narrativeData_1.push(['Resumen Ejecutivo']);
                            narrativeData_1.push([report.narrative.executive_summary]);
                            narrativeData_1.push([]);
                        }
                        if (report.narrative.key_insights && report.narrative.key_insights.length > 0) {
                            narrativeData_1.push(['Insights Clave']);
                            report.narrative.key_insights.forEach(function (insight) {
                                narrativeData_1.push(["\u2022 ".concat(insight)]);
                            });
                            narrativeData_1.push([]);
                        }
                        if (report.narrative.recommendations && report.narrative.recommendations.length > 0) {
                            narrativeData_1.push(['Recomendaciones']);
                            report.narrative.recommendations.forEach(function (recommendation) {
                                narrativeData_1.push(["\u2192 ".concat(recommendation)]);
                            });
                        }
                        narrativeWorksheet = XLSX.utils.aoa_to_sheet(narrativeData_1);
                        narrativeWorksheet['!cols'] = [{ wch: 80 }];
                        XLSX.utils.book_append_sheet(workbook, narrativeWorksheet, 'Análisis');
                    }
                    filename = options.customFilename || generateFilename(report.report_type, 'xlsx');
                    XLSX.writeFile(workbook, filename);
                    return [2 /*return*/];
            }
        });
    });
};
// ==========================================
// Exportación a PDF
// ==========================================
export var exportToPDF = function (report_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([report_1], args_1, true), void 0, function (report, options) {
        var jsPDFModule, jsPDF, importError_1, doc_1, yPosition_1, _loop_1, _a, _b, section, totalsData, summaryLines, filename, error_1;
        var _c, _d;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 10, , 11]);
                    return [4 /*yield*/, import('jspdf')];
                case 1:
                    jsPDFModule = _e.sent();
                    jsPDF = jsPDFModule.default;
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, import('jspdf-autotable')];
                case 3:
                    _e.sent();
                    return [3 /*break*/, 5];
                case 4:
                    importError_1 = _e.sent();
                    // Si falla la importación, usar versión simple directamente
                    console.info('🔄 autoTable no disponible, usando versión simple de PDF');
                    return [2 /*return*/, exportToPDFSimple(report, options)];
                case 5:
                    doc_1 = new jsPDF();
                    yPosition_1 = 20;
                    // Verificar que autoTable esté disponible después de la importación
                    if (typeof doc_1.autoTable !== 'function') {
                        console.info('🔄 autoTable no se cargó correctamente, usando versión simple de PDF');
                        return [2 /*return*/, exportToPDFSimple(report, options)];
                    }
                    // Configuración de fuentes
                    doc_1.setFont('helvetica');
                    // Título del reporte
                    doc_1.setFontSize(18);
                    doc_1.setTextColor(0, 0, 0);
                    doc_1.text(getReportTitle(report.report_type), 20, yPosition_1);
                    yPosition_1 += 15;
                    // Metadatos
                    if (options.includeMetadata !== false) {
                        doc_1.setFontSize(10);
                        doc_1.setTextColor(60, 60, 60);
                        doc_1.text("Empresa: ".concat(report.project_context), 20, yPosition_1);
                        yPosition_1 += 7;
                        doc_1.text("Per\u00EDodo: ".concat(formatDate(report.period.from_date), " - ").concat(formatDate(report.period.to_date)), 20, yPosition_1);
                        yPosition_1 += 7;
                        doc_1.text("Generado: ".concat(formatDate(report.generated_at)), 20, yPosition_1);
                        yPosition_1 += 15;
                    }
                    if (!(report.table && report.table.sections)) return [3 /*break*/, 9];
                    _loop_1 = function (section) {
                        var tableData, flattenedItems, tableError_1;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    // Verificar si necesitamos nueva página
                                    if (yPosition_1 > 250) {
                                        doc_1.addPage();
                                        yPosition_1 = 20;
                                    }
                                    // Título de sección
                                    doc_1.setFontSize(14);
                                    doc_1.setTextColor(0, 0, 0);
                                    doc_1.text(section.section_name, 20, yPosition_1);
                                    yPosition_1 += 10;
                                    tableData = [];
                                    flattenedItems = flattenAccountItems(section.items || []);
                                    flattenedItems.forEach(function (item) {
                                        var indent = '  '.repeat(item.level || 0);
                                        tableData.push([
                                            item.account_code,
                                            indent + item.account_name,
                                            formatCurrency(item.opening_balance),
                                            formatCurrency(item.movements),
                                            formatCurrency(item.closing_balance)
                                        ]);
                                    });
                                    // Agregar total de sección
                                    if (section.total) {
                                        tableData.push([
                                            '',
                                            "TOTAL ".concat(section.section_name),
                                            '',
                                            '',
                                            formatCurrency(section.total)
                                        ]);
                                    }
                                    _f.label = 1;
                                case 1:
                                    _f.trys.push([1, 2, , 4]);
                                    doc_1.autoTable({
                                        head: [['Código', 'Cuenta', 'Saldo Inicial', 'Movimientos', 'Saldo Final']],
                                        body: tableData,
                                        startY: yPosition_1,
                                        styles: {
                                            fontSize: 8,
                                            cellPadding: 3,
                                            textColor: [0, 0, 0]
                                        },
                                        headStyles: {
                                            fillColor: [66, 139, 202],
                                            textColor: [255, 255, 255],
                                            fontStyle: 'bold'
                                        },
                                        columnStyles: {
                                            0: { cellWidth: 25 },
                                            1: { cellWidth: 80 },
                                            2: { cellWidth: 25, halign: 'right' },
                                            3: { cellWidth: 25, halign: 'right' },
                                            4: { cellWidth: 25, halign: 'right' }
                                        },
                                        alternateRowStyles: {
                                            fillColor: [245, 245, 245]
                                        }
                                    });
                                    // Actualizar posición Y después de la tabla
                                    yPosition_1 = ((_c = doc_1.lastAutoTable) === null || _c === void 0 ? void 0 : _c.finalY) + 15 || yPosition_1 + (tableData.length * 8) + 15;
                                    return [3 /*break*/, 4];
                                case 2:
                                    tableError_1 = _f.sent();
                                    console.error('Error al crear tabla:', tableError_1);
                                    return [4 /*yield*/, createManualTable(doc_1, tableData, yPosition_1)];
                                case 3:
                                    // Fallback: crear tabla manual sin autoTable
                                    yPosition_1 = _f.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, _b = report.table.sections;
                    _e.label = 6;
                case 6:
                    if (!(_a < _b.length)) return [3 /*break*/, 9];
                    section = _b[_a];
                    return [5 /*yield**/, _loop_1(section)];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    _a++;
                    return [3 /*break*/, 6];
                case 9:
                    // Totales generales
                    if (report.table && report.table.totals && Object.keys(report.table.totals).length > 0) {
                        // Verificar espacio para totales
                        if (yPosition_1 > 220) {
                            doc_1.addPage();
                            yPosition_1 = 20;
                        }
                        doc_1.setFontSize(14);
                        doc_1.setTextColor(0, 0, 0);
                        doc_1.text('RESUMEN GENERAL', 20, yPosition_1);
                        yPosition_1 += 10;
                        totalsData = Object.entries(report.table.totals).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            return [
                                key.replace(/_/g, ' ').toUpperCase(),
                                formatCurrency(value)
                            ];
                        });
                        try {
                            doc_1.autoTable({
                                body: totalsData,
                                startY: yPosition_1,
                                styles: {
                                    fontSize: 10,
                                    cellPadding: 5,
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: { cellWidth: 100, fontStyle: 'bold' },
                                    1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
                                },
                                alternateRowStyles: {
                                    fillColor: [240, 248, 255]
                                }
                            });
                            yPosition_1 = ((_d = doc_1.lastAutoTable) === null || _d === void 0 ? void 0 : _d.finalY) + 15 || yPosition_1 + (totalsData.length * 12) + 15;
                        }
                        catch (tableError) {
                            console.error('Error al crear tabla de totales:', tableError);
                            // Fallback manual para totales
                            totalsData.forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                doc_1.text("".concat(key, ": ").concat(value), 20, yPosition_1);
                                yPosition_1 += 8;
                            });
                            yPosition_1 += 10;
                        }
                    }
                    // Narrativa (opcional)
                    if (options.includeNarrative && report.narrative) {
                        doc_1.addPage();
                        yPosition_1 = 20;
                        doc_1.setFontSize(16);
                        doc_1.setTextColor(0, 0, 0);
                        doc_1.text('ANÁLISIS DEL REPORTE', 20, yPosition_1);
                        yPosition_1 += 15;
                        // Resumen ejecutivo
                        if (report.narrative.executive_summary) {
                            doc_1.setFontSize(12);
                            doc_1.setTextColor(40, 40, 40);
                            doc_1.text('Resumen Ejecutivo', 20, yPosition_1);
                            yPosition_1 += 8;
                            doc_1.setFontSize(10);
                            doc_1.setTextColor(60, 60, 60);
                            summaryLines = doc_1.splitTextToSize(report.narrative.executive_summary, 170);
                            doc_1.text(summaryLines, 20, yPosition_1);
                            yPosition_1 += summaryLines.length * 5 + 10;
                        }
                        // Insights clave
                        if (report.narrative.key_insights && report.narrative.key_insights.length > 0) {
                            if (yPosition_1 > 250) {
                                doc_1.addPage();
                                yPosition_1 = 20;
                            }
                            doc_1.setFontSize(12);
                            doc_1.setTextColor(40, 40, 40);
                            doc_1.text('Insights Clave', 20, yPosition_1);
                            yPosition_1 += 8;
                            doc_1.setFontSize(10);
                            doc_1.setTextColor(60, 60, 60);
                            report.narrative.key_insights.forEach(function (insight) {
                                var insightLines = doc_1.splitTextToSize("\u2022 ".concat(insight), 170);
                                doc_1.text(insightLines, 20, yPosition_1);
                                yPosition_1 += insightLines.length * 5 + 3;
                                if (yPosition_1 > 270) {
                                    doc_1.addPage();
                                    yPosition_1 = 20;
                                }
                            });
                            yPosition_1 += 10;
                        }
                        // Recomendaciones
                        if (report.narrative.recommendations && report.narrative.recommendations.length > 0) {
                            if (yPosition_1 > 250) {
                                doc_1.addPage();
                                yPosition_1 = 20;
                            }
                            doc_1.setFontSize(12);
                            doc_1.setTextColor(40, 40, 40);
                            doc_1.text('Recomendaciones', 20, yPosition_1);
                            yPosition_1 += 8;
                            doc_1.setFontSize(10);
                            doc_1.setTextColor(60, 60, 60);
                            report.narrative.recommendations.forEach(function (recommendation) {
                                var recLines = doc_1.splitTextToSize("\u2192 ".concat(recommendation), 170);
                                doc_1.text(recLines, 20, yPosition_1);
                                yPosition_1 += recLines.length * 5 + 3;
                                if (yPosition_1 > 270) {
                                    doc_1.addPage();
                                    yPosition_1 = 20;
                                }
                            });
                        }
                    }
                    filename = options.customFilename || generateFilename(report.report_type, 'pdf');
                    // Guardar el PDF
                    doc_1.save(filename);
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _e.sent();
                    // Error crítico que no puede ser manejado por el fallback interno
                    console.error('Error crítico al generar PDF:', error_1);
                    throw new Error("Error al generar PDF: ".concat(error_1 instanceof Error ? error_1.message : 'Error desconocido'));
                case 11: return [2 /*return*/];
            }
        });
    });
};
// ==========================================
// Exportación a PDF simplificada (sin autoTable)
// ==========================================
export var exportToPDFSimple = function (report_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([report_1], args_1, true), void 0, function (report, options) {
        var jsPDFModule, jsPDF, doc_2, yPosition_2, lineHeight_1, pageHeight_1, _a, _b, section, flattenedItems, summaryLines, filename, error_2;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, import('jspdf')];
                case 1:
                    jsPDFModule = _c.sent();
                    jsPDF = jsPDFModule.default;
                    doc_2 = new jsPDF();
                    yPosition_2 = 20;
                    lineHeight_1 = 6;
                    pageHeight_1 = 280;
                    // Configuración de fuentes
                    doc_2.setFont('helvetica');
                    // Título del reporte
                    doc_2.setFontSize(16);
                    doc_2.setTextColor(0, 0, 0);
                    doc_2.text(getReportTitle(report.report_type), 20, yPosition_2);
                    yPosition_2 += 12;
                    // Metadatos
                    if (options.includeMetadata !== false) {
                        doc_2.setFontSize(10);
                        doc_2.setTextColor(60, 60, 60);
                        doc_2.text("Empresa: ".concat(report.project_context), 20, yPosition_2);
                        yPosition_2 += lineHeight_1;
                        doc_2.text("Per\u00EDodo: ".concat(formatDate(report.period.from_date), " - ").concat(formatDate(report.period.to_date)), 20, yPosition_2);
                        yPosition_2 += lineHeight_1;
                        doc_2.text("Generado: ".concat(formatDate(report.generated_at)), 20, yPosition_2);
                        yPosition_2 += 15;
                    }
                    // Secciones del reporte
                    if (report.table && report.table.sections) {
                        for (_a = 0, _b = report.table.sections; _a < _b.length; _a++) {
                            section = _b[_a];
                            // Verificar si necesitamos nueva página
                            if (yPosition_2 > pageHeight_1 - 40) {
                                doc_2.addPage();
                                yPosition_2 = 20;
                            }
                            // Título de sección
                            doc_2.setFontSize(12);
                            doc_2.setTextColor(0, 0, 0);
                            doc_2.setFont('helvetica', 'bold');
                            doc_2.text(section.section_name, 20, yPosition_2);
                            yPosition_2 += 10;
                            // Headers de la tabla
                            doc_2.setFontSize(8);
                            doc_2.setFont('helvetica', 'bold');
                            doc_2.text('Código', 20, yPosition_2);
                            doc_2.text('Cuenta', 50, yPosition_2);
                            doc_2.text('Saldo Inicial', 120, yPosition_2);
                            doc_2.text('Movimientos', 150, yPosition_2);
                            doc_2.text('Saldo Final', 180, yPosition_2);
                            yPosition_2 += lineHeight_1 + 2;
                            // Línea separadora
                            doc_2.line(20, yPosition_2 - 2, 200, yPosition_2 - 2);
                            // Datos de cuentas
                            doc_2.setFont('helvetica', 'normal');
                            flattenedItems = flattenAccountItems(section.items || []);
                            flattenedItems.forEach(function (item) {
                                // Verificar nueva página
                                if (yPosition_2 > pageHeight_1 - 10) {
                                    doc_2.addPage();
                                    yPosition_2 = 20;
                                    // Repetir headers en nueva página
                                    doc_2.setFontSize(8);
                                    doc_2.setFont('helvetica', 'bold');
                                    doc_2.text('Código', 20, yPosition_2);
                                    doc_2.text('Cuenta', 50, yPosition_2);
                                    doc_2.text('Saldo Inicial', 120, yPosition_2);
                                    doc_2.text('Movimientos', 150, yPosition_2);
                                    doc_2.text('Saldo Final', 180, yPosition_2);
                                    yPosition_2 += lineHeight_1 + 2;
                                    doc_2.line(20, yPosition_2 - 2, 200, yPosition_2 - 2);
                                    doc_2.setFont('helvetica', 'normal');
                                }
                                var indent = '  '.repeat(item.level || 0);
                                var accountName = (indent + item.account_name).length > 20
                                    ? (indent + item.account_name).substring(0, 20) + '...'
                                    : indent + item.account_name;
                                doc_2.text(item.account_code, 20, yPosition_2);
                                doc_2.text(accountName, 50, yPosition_2);
                                doc_2.text(formatCurrency(item.opening_balance), 120, yPosition_2);
                                doc_2.text(formatCurrency(item.movements), 150, yPosition_2);
                                doc_2.text(formatCurrency(item.closing_balance), 180, yPosition_2);
                                yPosition_2 += lineHeight_1;
                            });
                            // Total de sección
                            if (section.total) {
                                yPosition_2 += 3;
                                doc_2.line(20, yPosition_2 - 2, 200, yPosition_2 - 2);
                                doc_2.setFont('helvetica', 'bold');
                                doc_2.text("TOTAL ".concat(section.section_name), 50, yPosition_2);
                                doc_2.text(formatCurrency(section.total), 180, yPosition_2);
                                doc_2.setFont('helvetica', 'normal');
                                yPosition_2 += 10;
                            }
                            else {
                                yPosition_2 += 8;
                            }
                        }
                    }
                    // Totales generales
                    if (report.table && report.table.totals && Object.keys(report.table.totals).length > 0) {
                        // Verificar espacio para totales
                        if (yPosition_2 > pageHeight_1 - 60) {
                            doc_2.addPage();
                            yPosition_2 = 20;
                        }
                        doc_2.setFontSize(14);
                        doc_2.setFont('helvetica', 'bold');
                        doc_2.setTextColor(0, 0, 0);
                        doc_2.text('RESUMEN GENERAL', 20, yPosition_2);
                        yPosition_2 += 12;
                        doc_2.setFontSize(10);
                        Object.entries(report.table.totals).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            var label = key.replace(/_/g, ' ').toUpperCase();
                            doc_2.text("".concat(label, ":"), 20, yPosition_2);
                            doc_2.text(formatCurrency(value), 120, yPosition_2);
                            yPosition_2 += lineHeight_1 + 2;
                        });
                        yPosition_2 += 10;
                    }
                    // Narrativa (opcional)
                    if (options.includeNarrative && report.narrative) {
                        doc_2.addPage();
                        yPosition_2 = 20;
                        doc_2.setFontSize(14);
                        doc_2.setFont('helvetica', 'bold');
                        doc_2.setTextColor(0, 0, 0);
                        doc_2.text('ANÁLISIS DEL REPORTE', 20, yPosition_2);
                        yPosition_2 += 15;
                        // Resumen ejecutivo
                        if (report.narrative.executive_summary) {
                            doc_2.setFontSize(11);
                            doc_2.setFont('helvetica', 'bold');
                            doc_2.text('Resumen Ejecutivo', 20, yPosition_2);
                            yPosition_2 += 8;
                            doc_2.setFontSize(9);
                            doc_2.setFont('helvetica', 'normal');
                            summaryLines = doc_2.splitTextToSize(report.narrative.executive_summary, 170);
                            doc_2.text(summaryLines, 20, yPosition_2);
                            yPosition_2 += summaryLines.length * 5 + 10;
                        }
                        // Insights clave
                        if (report.narrative.key_insights && report.narrative.key_insights.length > 0) {
                            if (yPosition_2 > pageHeight_1 - 40) {
                                doc_2.addPage();
                                yPosition_2 = 20;
                            }
                            doc_2.setFontSize(11);
                            doc_2.setFont('helvetica', 'bold');
                            doc_2.text('Insights Clave', 20, yPosition_2);
                            yPosition_2 += 8;
                            doc_2.setFontSize(9);
                            doc_2.setFont('helvetica', 'normal');
                            report.narrative.key_insights.forEach(function (insight) {
                                var insightLines = doc_2.splitTextToSize("\u2022 ".concat(insight), 170);
                                doc_2.text(insightLines, 20, yPosition_2);
                                yPosition_2 += insightLines.length * 5 + 3;
                                if (yPosition_2 > pageHeight_1 - 10) {
                                    doc_2.addPage();
                                    yPosition_2 = 20;
                                }
                            });
                            yPosition_2 += 10;
                        }
                        // Recomendaciones
                        if (report.narrative.recommendations && report.narrative.recommendations.length > 0) {
                            if (yPosition_2 > pageHeight_1 - 40) {
                                doc_2.addPage();
                                yPosition_2 = 20;
                            }
                            doc_2.setFontSize(11);
                            doc_2.setFont('helvetica', 'bold');
                            doc_2.text('Recomendaciones', 20, yPosition_2);
                            yPosition_2 += 8;
                            doc_2.setFontSize(9);
                            doc_2.setFont('helvetica', 'normal');
                            report.narrative.recommendations.forEach(function (recommendation) {
                                var recLines = doc_2.splitTextToSize("\u2192 ".concat(recommendation), 170);
                                doc_2.text(recLines, 20, yPosition_2);
                                yPosition_2 += recLines.length * 5 + 3;
                                if (yPosition_2 > pageHeight_1 - 10) {
                                    doc_2.addPage();
                                    yPosition_2 = 20;
                                }
                            });
                        }
                    }
                    filename = options.customFilename || generateFilename(report.report_type, 'pdf');
                    // Guardar el PDF
                    doc_2.save(filename);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _c.sent();
                    console.error('Error al generar PDF simple:', error_2);
                    throw new Error("Error al generar PDF: ".concat(error_2 instanceof Error ? error_2.message : 'Error desconocido'));
                case 3: return [2 /*return*/];
            }
        });
    });
};
// ==========================================
// Función auxiliar para crear tabla manual (fallback)
// ==========================================
var createManualTable = function (doc, tableData, startY) { return __awaiter(void 0, void 0, void 0, function () {
    var yPosition, lineHeight, columnWidths, startX, headers, currentX;
    return __generator(this, function (_a) {
        yPosition = startY;
        lineHeight = 8;
        columnWidths = [25, 80, 25, 25, 25];
        startX = 20;
        // Headers
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        headers = ['Código', 'Cuenta', 'Saldo Inicial', 'Movimientos', 'Saldo Final'];
        currentX = startX;
        headers.forEach(function (header, index) {
            doc.text(header, currentX, yPosition);
            currentX += columnWidths[index];
        });
        yPosition += lineHeight + 2;
        // Data rows
        doc.setFont('helvetica', 'normal');
        tableData.forEach(function (row) {
            currentX = startX;
            row.forEach(function (cell, index) {
                var cellText = cell.length > 15 ? cell.substring(0, 15) + '...' : cell;
                doc.text(cellText, currentX, yPosition);
                currentX += columnWidths[index];
            });
            yPosition += lineHeight;
            // Check for page break
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });
        return [2 /*return*/, yPosition + 10];
    });
}); };
// ==========================================
// Utilidad auxiliar para aplanar elementos jerárquicos
// ==========================================
var flattenAccountItems = function (items) {
    var flattened = [];
    var addItemsRecursively = function (itemList, level) {
        if (level === void 0) { level = 0; }
        itemList.forEach(function (item) {
            flattened.push(__assign(__assign({}, item), { level: level }));
            if (item.children && item.children.length > 0) {
                addItemsRecursively(item.children, level + 1);
            }
        });
    };
    addItemsRecursively(items);
    return flattened;
};
// ==========================================
// Exportación unificada
// ==========================================
export var exportReport = function (report, format, options) {
    if (options === void 0) { options = {}; }
    switch (format) {
        case 'csv':
            exportToCSV(report, options);
            return Promise.resolve();
        case 'excel':
            return exportToExcel(report, options);
        case 'pdf':
            // Intentar primero con autoTable, si falla usar versión simple
            return exportToPDF(report, options).catch(function (error) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.info('🔄 Activando fallback a PDF simple debido a:', error.message);
                    return [2 /*return*/, exportToPDFSimple(report, options)];
                });
            }); });
        default:
            return Promise.reject(new Error("Formato no soportado: ".concat(format)));
    }
};
