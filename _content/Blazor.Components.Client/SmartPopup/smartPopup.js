export function observe(element, dotnetRef) {
    const update = () => {
        const rect = element.getBoundingClientRect();
        dotnetRef.invokeMethodAsync("RecalculatePosition",
            rect.top,
            rect.left,
            rect.width,
            rect.height,
            window.innerWidth,
            window.innerHeight
        );
    };

    const observer = new ResizeObserver(update);
    observer.observe(element);

    window.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    update();
}

