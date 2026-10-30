import { Bill, SlabDetail } from '../types';

/**
 * Format currency in Pakistani Rupees (PKR)
 */
export function formatPKR(amount: number): string {
  if (isNaN(amount)) return 'Rs. 0';
  return 'Rs. ' + Math.round(amount).toLocaleString('en-PK');
}

/**
 * Pakistani National Electric Power Regulatory Authority (NEPRA) slab rates (Residential A-1)
 */
export const TARIFF_SLABS = [
  { min: 1, max: 100, rate: 7, label: '1 - 100 units' },
  { min: 101, max: 200, rate: 11, label: '101 - 200 units' },
  { min: 201, max: 300, rate: 16, label: '201 - 300 units' },
  { min: 301, max: Infinity, rate: 22, label: 'Above 300 units' },
];

export const FUEL_ADJUSTMENT_PER_UNIT = 3.25; // Rs. 3.25 / unit
export const ELECTRICITY_DUTY_RATE = 0.015; // 1.5%
export const GST_RATE = 0.17; // 17% GST
export const PTV_FEE = 35; // Flat Rs. 35 TV license fee
export const LATE_SURCHARGE_RATE = 0.05; // 5% late fee

export interface BillCalculationResult {
  unitsConsumed: number;
  slabBreakdown: SlabDetail[];
  energyCharges: number;
  fuelPriceAdjustment: number;
  electricityDuty: number;
  tvFee: number;
  gst: number;
  totalCurrentBill: number;
  lateFeeSurcharge: number;
  payableAfterDueDate: number;
}

/**
 * Calculate electricity bill components based on meter readings
 */
export function calculateBillCharges(previousReading: number, currentReading: number): BillCalculationResult {
  const unitsConsumed = Math.max(0, currentReading - previousReading);
  const slabBreakdown: SlabDetail[] = [];
  let remainingUnits = unitsConsumed;
  let energyCharges = 0;

  if (unitsConsumed === 0) {
    slabBreakdown.push({
      slab: '1 - 100 units',
      units: 0,
      rate: 16.48,
      amount: 0,
    });
  } else {
    for (const slab of TARIFF_SLABS) {
      if (remainingUnits <= 0) break;
      const slabCapacity = slab.max === Infinity ? remainingUnits : slab.max - slab.min + 1;
      const unitsInThisSlab = Math.min(remainingUnits, slabCapacity);
      const amount = unitsInThisSlab * slab.rate;
      
      slabBreakdown.push({
        slab: slab.label,
        units: unitsInThisSlab,
        rate: slab.rate,
        amount: Math.round(amount),
      });

      energyCharges += amount;
      remainingUnits -= unitsInThisSlab;
    }
  }

  const fuelPriceAdjustment = Math.round(unitsConsumed * FUEL_ADJUSTMENT_PER_UNIT);
  const electricityDuty = Math.round(energyCharges * ELECTRICITY_DUTY_RATE);
  const gst = Math.round((energyCharges + fuelPriceAdjustment) * GST_RATE);
  const tvFee = unitsConsumed > 0 ? PTV_FEE : 0;
  
  const totalCurrentBill = Math.round(energyCharges + fuelPriceAdjustment + electricityDuty + gst + tvFee);
  const lateFeeSurcharge = Math.round(totalCurrentBill * LATE_SURCHARGE_RATE);
  const payableAfterDueDate = totalCurrentBill + lateFeeSurcharge;

  return {
    unitsConsumed,
    slabBreakdown,
    energyCharges: Math.round(energyCharges),
    fuelPriceAdjustment,
    electricityDuty,
    tvFee,
    gst,
    totalCurrentBill,
    lateFeeSurcharge,
    payableAfterDueDate,
  };
}

/**
 * Helper to build an official Bill object
 */
export function createBillObject(
  billId: string,
  consumer: { id: string; name: string; consumerNumber?: string; meterNumber?: string },
  billingMonth: string,
  previousReading: number,
  currentReading: number,
  issueDateStr?: string,
  dueDateStr?: string,
  status: 'Paid' | 'Unpaid' | 'Overdue' = 'Unpaid'
): Bill {
  const charges = calculateBillCharges(previousReading, currentReading);
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);

  const issueDate = issueDateStr || new Date().toISOString().split('T')[0];
  const dueDate = dueDateStr || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  return {
    id: billId,
    billNumber: `VC-${randomSuffix}`,
    consumerId: consumer.id,
    consumerName: consumer.name,
    consumerNumber: consumer.consumerNumber || `04-${randomSuffix.toString().slice(0, 5)}-001`,
    meterNumber: consumer.meterNumber || `MTR-${randomSuffix.toString().slice(0, 4)}`,
    billingMonth,
    issueDate,
    dueDate,
    previousReading,
    currentReading,
    status,
    ...charges,
  };
}
