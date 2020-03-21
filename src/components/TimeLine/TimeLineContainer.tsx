import React, { useState, useEffect } from "react";
import Timeline from "react-calendar-timeline";
// make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import uuid from "uuid/v4";

const groups = [
  { id: 1, title: "group 1", rightTitle: "test", stackItems: true, height: 30 },
  { id: 2, title: "group 2" }
];

const items = [
  {
    id: 1,
    group: 1,
    title: "Random title",
    start_time: moment(),
    end_time: moment().add(1, "hour"),
    canMove: true,
    canResize: false,
    canChangeGroup: false,
    itemProps: {
      // these optional attributes are passed to the root <div /> of each item as <div {...itemProps} />
      "data-custom-attribute": "wlow content",
      "aria-hidden": true,
      onDoubleClick: () => {
        console.log("You clicked double!");
      },
      className: "weekend",
      style: {
        background: "fuchsia"
      }
    }
  },
  {
    id: 2,
    group: 2,
    title: "item 2",
    start_time: moment().add(-0.5, "hour"),
    end_time: moment().add(0.5, "hour")
  },
  {
    id: 3,
    group: 1,
    title: "item 3",
    start_time: moment().add(2, "hour"),
    end_time: moment().add(3, "hour")
  }
];
interface Props {}

const TimeLineContainer = (props: Props) => {
  const groupRenderer = ({ group }: any) => {
    return (
      <div className="custom-group">
        <span className="title" style={{ color: "red" }}>
          {group.title}
        </span>
        <p className="tip" style={{ color: "red" }}>
          {group.tip}
        </p>
      </div>
    );
  };
  const itemRenderer = ({
    item,
    timelineContext,
    itemContext,
    getItemProps,
    getResizeProps
  }: any) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const backgroundColor = itemContext.selected
      ? itemContext.dragging
        ? "red"
        : item.selectedBgColor
      : item.bgColor;
    const borderColor = itemContext.resizing ? "red" : item.color;
    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            color: item.color,
            borderColor,
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 4,
            borderLeftWidth: itemContext.selected ? 3 : 1,
            borderRightWidth: itemContext.selected ? 3 : 1
          },
          onMouseDown: () => {
            console.log("on item click", item);
          }
        })}
      >
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}
        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: "hidden",
            paddingLeft: 3,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {itemContext.title}
        </div>
        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
      </div>
    );
  };

  const [customItems, setCustomItems] = useState<any>(items);
  const [customGroups, setCustomGroups] = useState<any>(groups);

  console.log(customGroups);

  const [formData, setFormData] = useState({
    text: "",
    startTime: -0.5,
    endTime: 0.5,
    groupName: ""
  });

  const [groupData, setGroupData] = useState({
    groupName: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const {
      target: { name, value }
    } = e;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCustomItems([
      ...customItems,
      {
        id: uuid(),
        group: formData.groupName,
        title: formData.text,
        start_time: moment().add(formData.startTime, "hour"),
        end_time: moment().add(formData.endTime, "hour")
      }
    ]);
  };

  console.log(formData);

  return (
    <>
      <Timeline
        groups={customGroups}
        items={customItems}
        defaultTimeStart={moment().add(-12, "hour")}
        defaultTimeEnd={moment().add(12, "hour")}
        itemRenderer={itemRenderer}
        groupRenderer={groupRenderer}
      />
      <form onSubmit={handleSubmit}>
        <h2>어떤 그룹?</h2>
        <select
          onChange={handleChange}
          value={formData.groupName}
          name={"group"}
        >
          {customGroups.map((g: any) => (
            <option key={g.id}>{g.title}</option>
          ))}
        </select>
        <h2>text</h2>
        <input
          onChange={handleChange}
          type="text"
          value={formData.text}
          name={"text"}
        />
        <h2>startTime</h2>
        <input
          onChange={handleChange}
          type="number"
          value={formData.startTime}
          name={"startTime"}
        />
        <h2>endTime</h2>
        <input
          onChange={handleChange}
          type="number"
          value={formData.endTime}
          name={"endTime"}
        />
        <br></br>
        <button type={"submit"}>SUBMIT</button>
      </form>

      <hr />
      <form
        onSubmit={e => {
          e.preventDefault();
          setCustomGroups([
            ...customGroups,
            { id: uuid(), title: groupData.groupName }
          ]);
        }}
      >
        <h2>group name</h2>
        <input
          onChange={e => {
            setGroupData({ ...groupData, groupName: e.target.value });
          }}
          type="text"
          value={groupData.groupName}
          name={"groupName"}
        />
        <button>그룹 제출</button>
      </form>
    </>
  );
};

export default TimeLineContainer;
