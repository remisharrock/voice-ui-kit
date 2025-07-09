import { RTVIEvent } from "@pipecat-ai/client-js";
import {
  usePipecatClientTransportState,
  useRTVIClientEvent,
} from "@pipecat-ai/client-react";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ProcessingMetric {
  processor: string;
  value: number;
}

interface MetricData {
  timestamp: string;
  value: number;
}

interface MetricsState {
  [processorName: string]: MetricData[];
}

interface TokenMetrics {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}

export const Metrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsState>({});
  const [tokenMetrics, setTokenMetrics] = useState<Partial<TokenMetrics>>({});

  const transportState = usePipecatClientTransportState();

  useRTVIClientEvent(RTVIEvent.Connected, () => {
    setMetrics({});
    setTokenMetrics({
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0,
    });
  });

  useRTVIClientEvent(RTVIEvent.Metrics, (data) => {
    // Handle processing metrics
    if (data?.processing && Array.isArray(data.processing)) {
      const timestamp = new Date().toISOString();

      setMetrics((prevMetrics) => {
        const newMetrics = { ...prevMetrics };

        (data.processing ?? []).forEach((item: ProcessingMetric) => {
          const { processor, value } = item;

          if (!newMetrics[processor]) {
            newMetrics[processor] = [];
          }

          // Limit array to last 100 entries to prevent excessive memory use
          const updatedMetrics = [
            ...newMetrics[processor],
            { timestamp, value },
          ].slice(-100);

          newMetrics[processor] = updatedMetrics;
        });

        return newMetrics;
      });
    }

    // Handle token metrics
    // @ts-expect-error - tokens type not defined
    const tokens = data?.tokens;
    if (tokens && Array.isArray(tokens) && tokens.length > 0) {
      const tokenData = tokens[0];

      setTokenMetrics((prev) => ({
        completion_tokens:
          prev.completion_tokens + (tokenData.completion_tokens || 0),
        prompt_tokens: prev.prompt_tokens + (tokenData.prompt_tokens || 0),
        total_tokens: prev.total_tokens + (tokenData.total_tokens || 0),
      }));
    }
  });

  const generateChartData = (processorName: string, data: MetricData[]) => {
    return {
      labels: data.map((d) => {
        const date = new Date(d.timestamp);
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
      }),
      datasets: [
        {
          label: `TTFB (${processorName})`,
          data: data.map((d) => d.value * 1000), // Convert to ms for better readability
          borderColor: getColorForProcessor(processorName),
          backgroundColor: getColorForProcessor(processorName, 0.2),
          tension: 0.4,
        },
      ],
    };
  };

  // Simple function to generate consistent colors based on processor name
  const getColorForProcessor = (processor: string, alpha = 1) => {
    const hash = processor.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const h = Math.abs(hash) % 360;
    return `hsla(${h}, 70%, 50%, ${alpha})`;
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: "Time (ms)",
        },
        beginAtZero: true,
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ms`;
          },
        },
      },
    },
  };

  const isConnecting =
    transportState === "authenticating" || transportState === "connecting";
  const isConnected =
    transportState === "connected" || transportState === "ready";

  const hasTokenMetrics = Object.keys(tokenMetrics).length > 0;
  const hasMetrics = Object.keys(metrics).length > 0;

  if (hasMetrics || hasTokenMetrics) {
    return (
      <div className="vkui:@container/metrics vkui:grid vkui:gap-6 vkui:items-start vkui:p-4 vkui:max-h-full vkui:overflow-auto">
        {hasTokenMetrics && (
          <>
            <h2 className="vkui:text-xl vkui:font-semibold">Token Usage</h2>
            <div className="vkui:grid vkui:grid-cols-1 vkui:@xl/metrics:grid-cols-2 vkui:@3xl/metrics:grid-cols-3 vkui:gap-4">
              <div className="vkui:bg-card vkui:rounded-md vkui:p-3 vkui:shadow-sm">
                <div className="vkui:text-sm vkui:text-muted-foreground">
                  Prompt Tokens
                </div>
                <div className="vkui:text-2xl vkui:font-medium">
                  {tokenMetrics.prompt_tokens}
                </div>
              </div>
              <div className="vkui:bg-card vkui:rounded-md vkui:p-3 vkui:shadow-sm">
                <div className="vkui:text-sm vkui:text-muted-foreground">
                  Completion Tokens
                </div>
                <div className="vkui:text-2xl vkui:font-medium">
                  {tokenMetrics.completion_tokens}
                </div>
              </div>
              <div className="vkui:bg-card vkui:rounded-md vkui:p-3 vkui:shadow-sm">
                <div className="vkui:text-sm vkui:text-muted-foreground">
                  Total Tokens
                </div>
                <div className="vkui:text-2xl vkui:font-medium">
                  {tokenMetrics.total_tokens}
                </div>
              </div>
            </div>
          </>
        )}
        {hasMetrics && (
          <>
            <h2 className="vkui:text-xl vkui:font-semibold">TTFB Metrics</h2>
            <div className="vkui:grid vkui:grid-cols-1 vkui:@xl/metrics:grid-cols-2 vkui:@3xl/metrics:grid-cols-3 vkui:gap-4">
              {Object.entries(metrics).map(([processorName, data]) => (
                <div
                  key={processorName}
                  className="vkui:bg-card vkui:border vkui:rounded-lg vkui:shadow-sm vkui:p-3 vkui:h-60"
                >
                  <h3 className="vkui:mb-2">{processorName}</h3>
                  <div className="vkui:h-44">
                    <Line
                      data={generateChartData(processorName, data)}
                      options={chartOptions}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="vkui:flex vkui:items-center vkui:justify-center vkui:h-full">
        <div className="vkui:text-muted-foreground vkui:text-sm">
          Connecting to agent...
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="vkui:flex vkui:items-center vkui:justify-center vkui:h-full">
        <div className="vkui:text-center vkui:p-4">
          <div className="vkui:text-muted-foreground vkui:mb-2">
            Not connected to agent
          </div>
          <p className="vkui:text-sm vkui:text-muted-foreground vkui:max-w-md">
            Connect to an agent to view metrics in real-time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vkui:flex vkui:items-center vkui:justify-center vkui:h-full">
      <div className="vkui:text-muted-foreground vkui:text-sm">
        Waiting for metrics data...
      </div>
    </div>
  );
};

export default Metrics;
