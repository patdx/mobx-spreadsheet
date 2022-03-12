import times from "lodash/times";
import type { NextPage } from "next";
import { Cell } from "../components/table/cell";

const COLUMN_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const Home: NextPage = () => {
  return (
    <div className="p-4 overflow-x-auto">
      <table className="table-fixed">
        {/* <colgroup>
          <col />
          {times(10, (colIndex) => (
            <col className="w-[100px]" width="100px" />
          ))}
        </colgroup> */}
        <thead>
          <tr>
            <th />
            {times(10, (colIndex) => (
              <th
                key={colIndex}
                className="border border-black"
                style={{ width: 100 }}
              >
                {COLUMN_LABELS[colIndex]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times(10, (rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              {times(10, (colIndex) => (
                <td key={colIndex} className="border border-black truncate">
                  <Cell cellKey={`${COLUMN_LABELS[colIndex]}${rowIndex + 1}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
