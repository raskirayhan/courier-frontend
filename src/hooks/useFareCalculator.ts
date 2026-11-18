import { useState, useMemo } from "react";

export interface FareCalculationInput {
  actualWeight: number;
  length: number;
  width: number;
  height: number;
  pickupZone: string;
  deliveryZone: string;
  isFragile?: boolean;
  isPriority?: boolean;
}

export function useFareCalculator(initialInput?: Partial<FareCalculationInput>) {
  const [actualWeight, setActualWeight] = useState(initialInput?.actualWeight ?? 2);
  const [length, setLength] = useState(initialInput?.length ?? 30);
  const [width, setWidth] = useState(initialInput?.width ?? 20);
  const [height, setHeight] = useState(initialInput?.height ?? 15);
  const [pickupZone, setPickupZone] = useState(initialInput?.pickupZone ?? "Dhaka North");
  const [deliveryZone, setDeliveryZone] = useState(initialInput?.deliveryZone ?? "Chittagong");
  const [isFragile, setIsFragile] = useState(initialInput?.isFragile ?? false);
  const [isPriority, setIsPriority] = useState(initialInput?.isPriority ?? false);

  const volumetricWeight = useMemo(() => {
    return Number(((length * width * height) / 5000).toFixed(2));
  }, [length, width, height]);

  const chargeableWeight = useMemo(() => {
    return Math.max(actualWeight, volumetricWeight);
  }, [actualWeight, volumetricWeight]);

  const isIntraZone = useMemo(() => {
    return pickupZone.split(" ")[0] === deliveryZone.split(" ")[0];
  }, [pickupZone, deliveryZone]);

  const calculation = useMemo(() => {
    const baseFare = isIntraZone ? 60 : 120;
    const weightSurcharge = Math.max(0, Math.ceil(chargeableWeight - 1)) * 25;
    const fragileSurcharge = isFragile ? 40 : 0;
    const prioritySurcharge = isPriority ? 80 : 0;
    const totalFare = baseFare + weightSurcharge + fragileSurcharge + prioritySurcharge;

    return {
      baseFare,
      weightSurcharge,
      fragileSurcharge,
      prioritySurcharge,
      totalFare,
      chargeableWeight,
      volumetricWeight,
      isIntraZone,
    };
  }, [isIntraZone, chargeableWeight, volumetricWeight, isFragile, isPriority]);

  return {
    actualWeight,
    setActualWeight,
    length,
    setLength,
    width,
    setWidth,
    height,
    setHeight,
    pickupZone,
    setPickupZone,
    deliveryZone,
    setDeliveryZone,
    isFragile,
    setIsFragile,
    isPriority,
    setIsPriority,
    ...calculation,
  };
}
