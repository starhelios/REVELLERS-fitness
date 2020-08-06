import styled, { css } from 'styled-components';
import COLORS from '../styles/color';
const Button = styled.button`
    background: transparent;
    border-radius: 5px;
    border: 1px solid ${COLORS.petrol};
    padding: 10px;
    color: ${COLORS.petrol};
    &:hover {
        background: ${COLORS.petrol};
        color: ${COLORS.white};
    }
    ${props =>
        props.filled &&
        css`
            background: ${COLORS.oyster};
            color: ${COLORS.white};
        `};
    ${props =>
        props.login &&
        css`
            border: 1px solid ${COLORS.petrol};
            color: ${COLORS.petrol};
            &:hover {
                background: ${COLORS.petrol};
                color: ${COLORS.white};
            }
        `}
    ${props =>
        props.signup &&
        css`
            border: 1px solid ${COLORS.rust};
            color: ${COLORS.rust};
            &:hover {
                background: ${COLORS.rust};
                color: ${COLORS.white};
            }
        `}
    ${props =>
        props.success &&
        css`
            border: 1px solid ${COLORS.success_green};
            color: ${COLORS.success_green};
            &:hover {
                background: ${COLORS.success_green};
                color: ${COLORS.white};
            }
        `}
    ${props =>
        props.error &&
        css`
            border: 1px solid ${COLORS.error_red};
            color: ${COLORS.error_red};
            &:hover {
                background: ${COLORS.error_red};
                color: ${COLORS.white};
            }
        `}
        ${props =>
            props.logout &&
            css`
                border: 1px solid ${COLORS.dove_grey};
                color: ${COLORS.dove_grey};
                &:hover {
                    background: ${COLORS.dove_grey};
                    color: ${COLORS.white};
                }
            `}
            ${props =>
                props.cancel &&
                css`
                    border: 1px solid ${COLORS.oyster};
                    color: ${COLORS.oyster};
                    &:hover {
                        background: ${COLORS.oyster};
                        color: ${COLORS.white};
                    }
                `}
            ${props =>
                props.disabled &&
                css`
                    border: 1px solid ${COLORS.oyster};
                    color: ${COLORS.oyster};
                    &:hover {
                        background: ${COLORS.oyster};
                        color: ${COLORS.white};
                    }
                `}
`;
export default Button;
