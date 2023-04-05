import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  text-align: center;
`;

const display = css`
  box-sizing: border-box;
  padding: 0;
  margin: 0 auto;
`;

function Loading() {
  return (
    <div css={display}>
      <RingLoader css={override} size={20} color={"#fff"} loading={true} />
    </div>
  );
}

export default Loading;
