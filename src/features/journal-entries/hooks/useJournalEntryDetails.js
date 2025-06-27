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
import { useState, useEffect, useCallback, useMemo } from 'react';
import { JournalEntryService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
/**
 * Hook para manejar un asiento contable individual con datos enriquecidos
 * Proporciona utilidades para trabajar con productos, terceros, términos de pago, etc.
 */
export var useJournalEntryDetails = function (entryId) {
    var _a = useState(null), entry = _a[0], setEntry = _a[1];
    var _b = useState(new Map()), enrichedPaymentTerms = _b[0], setEnrichedPaymentTerms = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var showError = useToast().error;
    // Obtener el asiento contable por ID
    var fetchEntry = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var journalEntry, enrichedTerms, paymentTermsError_1, err_1, errorMessage;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!entryId) {
                        setEntry(null);
                        setEnrichedPaymentTerms(new Map());
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setError(null);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, 10, 11]);
                    return [4 /*yield*/, JournalEntryService.getJournalEntryById(entryId)];
                case 2:
                    journalEntry = _b.sent();
                    setEntry(journalEntry);
                    if (!((_a = journalEntry.lines) === null || _a === void 0 ? void 0 : _a.some(function (line) { return line.payment_terms_id; }))) return [3 /*break*/, 7];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, JournalEntryService.getEnrichedPaymentTermsForEntry(journalEntry)];
                case 4:
                    enrichedTerms = _b.sent();
                    setEnrichedPaymentTerms(enrichedTerms);
                    return [3 /*break*/, 6];
                case 5:
                    paymentTermsError_1 = _b.sent();
                    console.warn('No se pudieron obtener los detalles completos de payment terms:', paymentTermsError_1);
                    // Continuar con la información básica
                    setEnrichedPaymentTerms(new Map());
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    setEnrichedPaymentTerms(new Map());
                    _b.label = 8;
                case 8: return [3 /*break*/, 11];
                case 9:
                    err_1 = _b.sent();
                    errorMessage = err_1 instanceof Error ? err_1.message : 'Error al obtener el asiento contable';
                    setError(errorMessage);
                    showError(errorMessage);
                    setEntry(null);
                    setEnrichedPaymentTerms(new Map());
                    return [3 /*break*/, 11];
                case 10:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); }, [entryId, showError]);
    // Refrescar el asiento contable
    var refresh = useCallback(function () {
        fetchEntry();
    }, [fetchEntry]);
    // Datos derivados usando los métodos utilitarios del servicio
    var derivedData = useMemo(function () {
        if (!entry)
            return null;
        return {
            products: JournalEntryService.extractProductInfo(entry),
            thirdParties: JournalEntryService.extractThirdPartyInfo(entry),
            // Usar payment terms básicos si no hay enriquecidos
            paymentTerms: enrichedPaymentTerms.size > 0
                ? Array.from(enrichedPaymentTerms.values())
                : JournalEntryService.extractPaymentTermsInfo(entry),
            calculationSummary: JournalEntryService.getCalculationSummary(entry),
            validation: JournalEntryService.validateJournalEntryCompleteness(entry)
        };
    }, [entry, enrichedPaymentTerms]);
    // Información agregada útil para la UI
    var aggregatedInfo = useMemo(function () {
        if (!entry || !derivedData)
            return null;
        var products = derivedData.products, thirdParties = derivedData.thirdParties, paymentTerms = derivedData.paymentTerms, calculationSummary = derivedData.calculationSummary;
        return {
            // Resumen de productos
            productSummary: {
                count: products.length,
                totalQuantity: products.reduce(function (sum, p) { return sum + (parseFloat(p.quantity || '0')); }, 0),
                hasProducts: products.length > 0
            },
            // Resumen de terceros
            thirdPartySummary: {
                count: thirdParties.length,
                customers: thirdParties.filter(function (tp) { return tp.type === 'customer'; }).length,
                suppliers: thirdParties.filter(function (tp) { return tp.type === 'supplier'; }).length,
                hasThirdParties: thirdParties.length > 0
            },
            // Resumen de términos de pago
            paymentTermsSummary: {
                count: paymentTerms.length,
                uniqueTerms: new Set(paymentTerms.map(function (pt) { return pt.code; })).size,
                hasPaymentTerms: paymentTerms.length > 0
            },
            // Estado del asiento
            statusInfo: {
                canEdit: entry.can_be_edited,
                canPost: entry.can_be_posted,
                isBalanced: entry.is_balanced,
                status: entry.status,
                hasDiscounts: parseFloat(calculationSummary.total_discount) > 0,
                hasTaxes: parseFloat(calculationSummary.total_taxes) > 0
            }
        };
    }, [entry, derivedData]);
    // Efecto para cargar datos cuando cambia el ID
    useEffect(function () {
        fetchEntry();
    }, [fetchEntry]);
    return {
        // Datos principales
        entry: entry,
        loading: loading,
        error: error,
        // Acciones
        refresh: refresh,
        // Datos derivados
        products: (derivedData === null || derivedData === void 0 ? void 0 : derivedData.products) || [],
        thirdParties: (derivedData === null || derivedData === void 0 ? void 0 : derivedData.thirdParties) || [],
        paymentTerms: (derivedData === null || derivedData === void 0 ? void 0 : derivedData.paymentTerms) || [],
        enrichedPaymentTerms: enrichedPaymentTerms, // Datos completos de payment terms con cronogramas
        calculationSummary: (derivedData === null || derivedData === void 0 ? void 0 : derivedData.calculationSummary) || {
            total_discount: '0.00',
            total_taxes: '0.00',
            total_net: '0.00',
            total_gross: '0.00',
            lines_with_products: 0,
            total_lines: 0
        },
        validation: (derivedData === null || derivedData === void 0 ? void 0 : derivedData.validation) || {
            is_valid: false,
            issues: [],
            can_be_posted: false,
            can_be_edited: false
        },
        // Información agregada
        aggregatedInfo: aggregatedInfo,
        // Indicadores de datos enriquecidos
        hasEnrichedPaymentTerms: enrichedPaymentTerms.size > 0
    };
};
/**
 * Hook simplificado para obtener solo los datos básicos de un asiento contable
 */
export var useJournalEntryBasic = function (entryId) {
    var _a, _b, _c;
    var _d = useJournalEntryDetails(entryId), entry = _d.entry, loading = _d.loading, error = _d.error, refresh = _d.refresh;
    return {
        entry: entry,
        loading: loading,
        error: error,
        refresh: refresh,
        // Información básica derivada
        isBalanced: (entry === null || entry === void 0 ? void 0 : entry.is_balanced) || false,
        canEdit: (entry === null || entry === void 0 ? void 0 : entry.can_be_edited) || false,
        canPost: (entry === null || entry === void 0 ? void 0 : entry.can_be_posted) || false,
        linesCount: ((_a = entry === null || entry === void 0 ? void 0 : entry.lines) === null || _a === void 0 ? void 0 : _a.length) || 0,
        hasProducts: ((_b = entry === null || entry === void 0 ? void 0 : entry.lines) === null || _b === void 0 ? void 0 : _b.some(function (line) { return line.product_id; })) || false,
        hasThirdParties: ((_c = entry === null || entry === void 0 ? void 0 : entry.lines) === null || _c === void 0 ? void 0 : _c.some(function (line) { return line.third_party_id; })) || false
    };
};
