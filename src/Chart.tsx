import { useMemo, TouchEvent, MouseEvent } from "react";
import { Bar } from "@visx/shape";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { scaleBand, scaleLinear } from "@visx/scale";
import { localPoint } from "@visx/event";
import { TooltipWithBounds, useTooltip, defaultStyles } from "@visx/tooltip";
import { AxisBottom, AxisLeft } from "@visx/axis";
import useMeasure from "react-use-measure";
import styled from "styled-components";
import { timeFormat } from "d3-time-format";
import { Group } from "@visx/group";

const data = appleStock.slice(0, 10);

const getYValue = (d: AppleStock) => d.close;

const getXValue = (d: AppleStock) => d.date;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  position: relative;
  width: 600px;
  height: 400px;
`;

const StyledSVG = styled.svg`
  overflow: visible;
`;

const tooltipStyles = {
  ...defaultStyles,
  borderRadius: 4,
  background: "black",
  color: "white",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const Chart = () => {
  const [ref, { width, height }] = useMeasure();

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<AppleStock>();

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, width],
        round: true,
        domain: data.map(getXValue),
        padding: 0.2,
      }),
    [width]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [height, 0],
        round: true,
        domain: [
          Math.min(...data.map(getYValue)) - 1,
          Math.max(...data.map(getYValue)),
        ],
      }),
    [height]
  );

  return (
    <Wrapper>
      <Container ref={ref}>
        <StyledSVG width={width} height={height} ref={ref}>
          <Group>
            {data.map((d) => {
              const xValue = getXValue(d);
              const barWidth = xScale.bandwidth();
              const barHeight = height - (yScale(getYValue(d)) ?? 0);
              const barX = xScale(xValue);
              const barY = height - barHeight;

              return (
                <Bar
                  key={`bar-${xValue}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill="orange"
                  onMouseMove={(
                    event:
                      | TouchEvent<SVGRectElement>
                      | MouseEvent<SVGRectElement>
                  ) => {
                    const eventSvgCoords = localPoint(event);

                    if (!eventSvgCoords) return;

                    showTooltip({
                      tooltipData: d,
                      tooltipTop: eventSvgCoords.y,
                      tooltipLeft: eventSvgCoords.x,
                    });
                  }}
                  onMouseLeave={() => hideTooltip()}
                />
              );
            })}
          </Group>

          <Group>
            <AxisBottom
              top={height}
              scale={xScale}
              tickFormat={(date) => timeFormat("%d")(new Date(date))}
            />
          </Group>

          <Group>
            <AxisLeft scale={yScale} />
          </Group>
        </StyledSVG>

        {tooltipData ? (
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            <b>{`${timeFormat("%b %d, %Y")(
              new Date(getXValue(tooltipData))
            )}`}</b>
            : ${getYValue(tooltipData)}
          </TooltipWithBounds>
        ) : null}
      </Container>
    </Wrapper>
  );
};

export default Chart;
