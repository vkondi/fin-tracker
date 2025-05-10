import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data01 = [
    {
      name: "Group A",
      value: 400,
    },
    {
      name: "Group B",
      value: 300,
    },
    {
      name: "Group C",
      value: 300,
    },
    {
      name: "Group D",
      value: 200,
    },
    {
      name: "Group E",
      value: 278,
    },
    {
      name: "Group F",
      value: 189,
    },
  ];
  const data02 = [
    { name: 'A', value: 2400, fill: '#ff0000' }, // Red
    { name: 'B', value: 4567, fill: '#00ff00' }, // Green
    { name: 'C', value: 1398, fill: '#0000ff' }, // Blue
    { name: 'D', value: 9800, fill: '#ffff00' }, // Yellow
    { name: 'E', value: 3908, fill: '#ff00ff' }, // Magenta
  ];


const Chart = () => {
    return <div className="border-2 border-red-600 w-full">
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Tooltip />
        {/* <Pie
        data={data01}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={50}
        fill="#8884d8"
      /> */}
        <Pie
          data={data02}
          dataKey="value"
          nameKey="name"
          // cx="50%"
          // cy="50%"
          innerRadius={50}
          outerRadius={80}
          fill="#82ca9d"
          label
          // label={({ name, value, percent }) => (
          //   `${name}: ${value}`
          // )}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
}

export default Chart;