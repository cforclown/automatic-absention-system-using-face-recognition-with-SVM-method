import { useEffect } from "react";

function useOnOutsideClick(ref, callback, togglerRef) {
    useEffect(() => {
        function handleClickOutside(e) {
            if(togglerRef && togglerRef.current.contains(e.target))
                return;
            if (ref.current && !ref.current.contains(e.target)) {
                if(callback)
                    callback(e);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [ref]);
}

export default useOnOutsideClick;