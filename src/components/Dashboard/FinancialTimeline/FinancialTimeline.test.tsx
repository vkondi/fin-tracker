import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FinancialTimeline from "./FinancialTimeline";
import * as ROOT_CONTEXT from "@/context/RootContext";
import * as FIN_CONTEXT from "@/context/FinContext";
import { FinancialSnapshotType } from "@/components/component.types";

vi.mock("@/context/RootContext", () => ({
  useRootContext: vi.fn(),
}));

vi.mock("@/context/FinContext", () => ({
  useFinContext: vi.fn(),
}));

// Mock recharts ResponsiveContainer to avoid jsdom sizing issues
vi.mock("recharts", async () => {
  const original = await vi.importActual("recharts");
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container" style={{ width: 800, height: 400 }}>
        {children}
      </div>
    ),
  };
});

describe("FinancialTimeline Component", () => {
  const mockUseRootContext = vi.mocked(ROOT_CONTEXT.useRootContext);
  const mockUseFinContext = vi.mocked(FIN_CONTEXT.useFinContext);
  const mockCaptureSnapshot = vi.fn();

  const mockToast = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const sampleSnapshots: FinancialSnapshotType[] = [
    {
      snapshot_date: "2025-06-01",
      total_invested: 50000,
      total_current: 52000,
      total_platforms: 1,
      total_owners: 1,
      created_at: "2025-06-01T10:00:00.000Z",
    },
    {
      snapshot_date: "2025-12-01",
      total_invested: 150000,
      total_current: 160000,
      total_platforms: 2,
      total_owners: 2,
      created_at: "2025-12-01T10:00:00.000Z",
    },
    {
      snapshot_date: "2026-05-01",
      total_invested: 300000,
      total_current: 330000,
      total_platforms: 3,
      total_owners: 2,
      created_at: "2026-05-01T10:00:00.000Z",
    },
    {
      snapshot_date: "2026-10-01",
      total_invested: 560540,
      total_current: 601250,
      total_platforms: 6,
      total_owners: 3,
      created_at: "2026-10-01T10:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseRootContext.mockReturnValue({
      isMobile: false,
      loader: { show: false },
      userId: "2", // Authorized user
      toast: mockToast,
    } as unknown as ROOT_CONTEXT.RootContextType);

    mockUseFinContext.mockReturnValue({
      snapshotData: sampleSnapshots,
      hasNoFinanceData: false,
      captureSnapshot: mockCaptureSnapshot,
    } as unknown as FIN_CONTEXT.FinContextType);
  });

  it("should return null if user has no finance data", () => {
    mockUseFinContext.mockReturnValue({
      snapshotData: [],
      hasNoFinanceData: true,
      captureSnapshot: mockCaptureSnapshot,
    } as unknown as FIN_CONTEXT.FinContextType);

    const { container } = render(<FinancialTimeline />);
    expect(container.firstChild).toBeNull();
  });

  it("should return null while loading", () => {
    mockUseRootContext.mockReturnValue({
      isMobile: false,
      loader: { show: true },
      userId: "2",
      toast: mockToast,
    } as unknown as ROOT_CONTEXT.RootContextType);

    const { container } = render(<FinancialTimeline />);
    expect(container.firstChild).toBeNull();
  });

  it("should render last updated date in header and badge", () => {
    render(<FinancialTimeline />);

    expect(screen.getByTestId("header-last-updated")).toBeInTheDocument();
    expect(screen.getByTestId("header-last-updated")).toHaveTextContent("Last updated:");
  });

  it("should render yearly filter with default current year (2026)", () => {
    render(<FinancialTimeline />);

    expect(screen.getByText("Financial Timeline")).toBeInTheDocument();
    expect(screen.getByText("Period:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2026" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2025" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All (Annual)" })).toBeInTheDocument();

    // 2026 is default selected
    expect(screen.getByRole("button", { name: "2026" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("(2 snapshots)")).toBeInTheDocument();
  });

  it("should switch to year-by-year mode when 'All (Annual)' is clicked", () => {
    render(<FinancialTimeline />);

    const allBtn = screen.getByRole("button", { name: "All (Annual)" });
    fireEvent.click(allBtn);

    expect(allBtn).toHaveAttribute("aria-pressed", "true");
    // Should show year-by-year count (2 years: 2025 and 2026)
    expect(screen.getByText("(2 years)")).toBeInTheDocument();
  });

  it("should switch period when 2025 is clicked", () => {
    render(<FinancialTimeline />);

    const y2025Btn = screen.getByRole("button", { name: "2025" });
    fireEvent.click(y2025Btn);

    expect(y2025Btn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("(2 snapshots)")).toBeInTheDocument();
  });

  it("should render 'Take a Snapshot' button for authorized user (userId: 2)", () => {
    render(<FinancialTimeline />);

    const triggerBtn = screen.getByRole("button", { name: "Take a Snapshot" });
    expect(triggerBtn).toBeInTheDocument();
  });

  it("should NOT render 'Take a Snapshot' button for unauthorized user (userId: 99)", () => {
    mockUseRootContext.mockReturnValue({
      isMobile: false,
      loader: { show: false },
      userId: "99", // Unauthorized user
      toast: mockToast,
    } as unknown as ROOT_CONTEXT.RootContextType);

    render(<FinancialTimeline />);

    expect(screen.queryByRole("button", { name: "Take a Snapshot" })).not.toBeInTheDocument();
  });

  it("should call captureSnapshot and toast on button click", async () => {
    mockCaptureSnapshot.mockResolvedValue({
      success: true,
      message: "Snapshot captured successfully",
    });

    render(<FinancialTimeline />);

    const triggerBtn = screen.getByRole("button", { name: "Take a Snapshot" });
    fireEvent.click(triggerBtn);

    await waitFor(() => {
      expect(mockCaptureSnapshot).toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalledWith("Snapshot captured successfully");
    });
  });
});
