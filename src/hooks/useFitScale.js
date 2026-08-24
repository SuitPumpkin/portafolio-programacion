import { useState, useEffect } from "react";

export function useFitScale(
  contentRef,
  containerRef,
  { minScale = 0.5, maxScale = 1 } = {}
) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;
      if (containerWidth > 0 && contentWidth > 0) {
        const newScale = Math.min(maxScale, Math.max(minScale, containerWidth / contentWidth));
        setScale((prev) => (Math.abs(prev - newScale) > 0.001 ? newScale : prev));
      }
    };

    compute();
    const observer = new ResizeObserver(compute);
    if (containerRef.current) observer.observe(containerRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [containerRef, contentRef, minScale, maxScale]);

  return scale;
}
