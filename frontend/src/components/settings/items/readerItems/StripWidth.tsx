import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useDebounce } from "use-debounce";
import { AppContext } from "../../../../App";
import Slider from "../../slider/Slider";

function StripWidth({ active }: { active: boolean }) {
    const [settings, setSetting] = useContext(AppContext)?.settings!;
    const [rawValue, setValue] = useState(settings.stripWidth);
    const [value] = useDebounce(rawValue, 1);
    const ref = useRef<HTMLInputElement>(null);
    const changed = useCallback(
        (value: string) => value === settings.stripWidth,
        [settings.stripWidth]
    );
    const change = useCallback(() => {
        if (!ref.current) return;
        if (settings.stripWidthControl === "AUTO")
            setSetting("stripWidthControl", "MANUAL");
        setValue(ref.current.value);
    }, [ref, settings.stripWidthControl]);

    useEffect(() => {
        setSetting("stripWidth", value);
        if (!changed(value)) setSetting("stripWidthControl", "MANUAL");
    }, [value]);
    return (
        <>
            <Slider
                onMouseDown={change}
                onTouchStart={change}
                onChange={change}
                value={rawValue}
                labelMin={(parseInt(rawValue || "30") || "30") + "%"}
                labelMax="100%"
                min="30"
                max="100"
                step="any"
                ref={ref}
                inactive={!active}
            />
        </>
    );
}

export default React.memo(StripWidth);
