import React from "react";
import styled from "styled-components";
import Spinner from "../spinner";

const StyledSpinner = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;

    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
`;

export const Loader = (
    <StyledSpinner>
        <Spinner size="md" />
    </StyledSpinner>
);

function LoaderComponent() {
    return (
        <StyledSpinner>
            <Spinner size="md" />
        </StyledSpinner>
    );
}
export default LoaderComponent;
