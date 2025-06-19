


import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

export interface GlassIconsItem {
  id: string;
  icon: React.ReactElement;
  color: string;
  label: string;
  href?: string;
  customClass?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
  reorderable?: boolean;
  onReorder?: (items: GlassIconsItem[]) => void;
}

const gradientMapping: Record<string, string> = {
  blue: "linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))",
  purple: "linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))",
  red: "linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))",
  indigo: "linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))",
  orange: "linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))",
  green: "linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))",
};

const GlassIcons: React.FC<GlassIconsProps> = ({
  items,
  className,
  reorderable,
  onReorder,
}) => {
  console.log('GlassIcons rendered with items:', items);
  console.log('GlassIcons reorderable:', reorderable);

  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorder) return;
    const updated = Array.from(items);
    const [removed] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, removed);
    onReorder(updated);
  };

  const renderItem = (item: GlassIconsItem, index: number) => {
    console.log('Rendering item:', item);
    
    const commonClasses = `relative bg-transparent outline-none w-[4.5em] h-[4.5em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] transition-transform duration-200 hover:-translate-y-1 group mb-8 ${
      item.customClass || ""
    }`;

    const content = (
      <>
        <span
          className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
          style={{
            ...getBackgroundStyle(item.color),
            boxShadow: "0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)",
          }}
        ></span>

        <span
          className="absolute top-0 left-0 w-full h-full rounded-[1.25em] bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] transform group-hover:[transform:translateZ(2em)]"
          style={{
            boxShadow: "0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset",
          }}
        >
          <span
            className="m-auto w-[1.5em] h-[1.5em] flex items-center justify-center"
            aria-hidden="true"
          >
            {item.icon}
          </span>
        </span>

        <span className="pointer-events-none absolute inset-0 rounded-[1.25em] overflow-hidden">
          <span className="absolute left-[-100%] top-0 w-[120%] h-full bg-white/40 opacity-0 rotate-45 group-hover:animate-glare" />
        </span>

        <span className="absolute top-full left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap leading-relaxed text-sm text-blue-600 mt-2 px-1">
          {item.label}
        </span>
      </>
    );

    if (item.href) {
      return (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={commonClasses}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        aria-label={item.label}
        className={commonClasses}
      >
        {content}
      </button>
    );
  };

  const gridClasses = `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-8 lg:gap-10 mx-auto py-8 px-4 overflow-visible ${className || ""}`;

  console.log('Grid classes:', gridClasses);

  return reorderable && onReorder ? (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="icons">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={gridClasses}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(drag) => (
                  <div ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps}>
                    {renderItem(item, index)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  ) : (
    <div className={gridClasses}>{items.map(renderItem)}</div>
  );
};

export default GlassIcons;
