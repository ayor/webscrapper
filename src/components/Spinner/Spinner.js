import React from "react";

const Spinner = props => (
    <span className={"spinner-border spinner-border-sm p-2 "+props.spinnerClass} role="status">
  <span className="sr-only">Loading...</span>
</span>
);

export default Spinner;