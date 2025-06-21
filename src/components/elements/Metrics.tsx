import { RTVIEvent } from "@pipecat-ai/client-js";
import {
  useRTVIClientEvent,
  useRTVIClientTransportState,
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

  const transportState = useRTVIClientTransportState();

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
      <div className="@container/metrics grid gap-6 items-start p-4 max-h-full overflow-auto">
        {hasTokenMetrics && (
          <>
            <h2 className="text-xl font-semibold">Token Usage</h2>
            <div className="grid grid-cols-1 @xl/metrics:grid-cols-2 @3xl/metrics:grid-cols-3 gap-4">
              <div className="bg-card rounded-md p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">
                  Prompt Tokens
                </div>
                <div className="text-2xl font-medium">
                  {tokenMetrics.prompt_tokens}
                </div>
              </div>
              <div className="bg-card rounded-md p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">
                  Completion Tokens
                </div>
                <div className="text-2xl font-medium">
                  {tokenMetrics.completion_tokens}
                </div>
              </div>
              <div className="bg-card rounded-md p-3 shadow-sm">
                <div className="text-sm text-muted-foreground">
                  Total Tokens
                </div>
                <div className="text-2xl font-medium">
                  {tokenMetrics.total_tokens}
                </div>
              </div>
            </div>
          </>
        )}
        {hasMetrics && (
          <>
            <h2 className="text-xl font-semibold">TTFB Metrics</h2>
            <div className="grid grid-cols-1 @xl/metrics:grid-cols-2 @3xl/metrics:grid-cols-3 gap-4">
              {Object.entries(metrics).map(([processorName, data]) => (
                <div
                  key={processorName}
                  className="bg-card border rounded-lg shadow-sm p-3 h-60"
                >
                  <h3 className="mb-2">{processorName}</h3>
                  <div className="h-44">
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
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground text-sm">
          Connecting to agent...
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-4">
          <div className="text-muted-foreground mb-2">
            Not connected to agent
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Connect to an agent to view metrics in real-time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground text-sm">
        Waiting for metrics data...
      </div>
    </div>
  );
};

export default Metrics;
