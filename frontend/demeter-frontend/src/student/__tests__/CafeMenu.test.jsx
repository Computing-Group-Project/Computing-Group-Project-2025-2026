import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CafeMenu from "../CafeMenu.jsx";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
}));

// Mock api
vi.mock("../../utils/api.js", () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock StudentLayout
vi.mock("../../layouts/StudentLayout.jsx", () => ({
  default: ({ children }) => <div data-testid="student-layout">{children}</div>,
}));

// Mock child components
vi.mock("../../components/common/SearchBar.jsx", () => ({
  default: (props) => <input data-testid="search-bar" placeholder={props.placeholder} onChange={props.onChange} />,
}));

vi.mock("../../components/common/FoodCard.jsx", () => ({
  default: ({ title }) => <div data-testid="food-card">{title}</div>,
}));

vi.mock("../../components/common/FoodModal.jsx", () => ({
  default: ({ food }) => <div data-testid="food-modal">{food.title}</div>,
}));

vi.mock("../../assets/burger.svg", () => ({ default: "burger.svg" }));

import api from "../../utils/api.js";

describe("CafeMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders menu items from API", async () => {
    api.get.mockImplementation((url) => {
      if (url.includes("/api/cafeterias/1")) {
        return Promise.resolve({ data: { data: { name: "The Last Drop", description: "Cozy cafe" } } });
      }
      if (url.includes("/api/menus/cafeteria/1")) {
        return Promise.resolve({
          data: {
            data: [
              { menuId: 1, name: "Neuro-Burger", description: "Tasty burger", basePrice: 45, cafeteriaId: 1, category: { name: "Mains" }, customizations: [] },
              { menuId: 2, name: "Quantum Quinoa", description: "Fresh bowl", basePrice: 38, cafeteriaId: 1, category: { name: "Bowls" }, customizations: [] },
            ],
          },
        });
      }
      if (url.includes("/api/categories")) {
        return Promise.resolve({ data: { data: [{ name: "Mains" }, { name: "Bowls" }] } });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<CafeMenu />);

    await waitFor(() => {
      expect(screen.getByText("Neuro-Burger")).toBeInTheDocument();
      expect(screen.getByText("Quantum Quinoa")).toBeInTheDocument();
    });
  });

  it("shows 'Cafe not found' when API fails", async () => {
    api.get.mockRejectedValue(new Error("Network error"));

    render(<CafeMenu />);

    await waitFor(() => {
      expect(screen.getByText("Cafe not found")).toBeInTheDocument();
    });
  });

  it("renders the cafe name in the banner", async () => {
    api.get.mockImplementation((url) => {
      if (url.includes("/api/cafeterias/1")) {
        return Promise.resolve({ data: { data: { name: "Skyline Sips", description: "Rooftop dining" } } });
      }
      if (url.includes("/api/menus/cafeteria/1")) {
        return Promise.resolve({ data: { data: [] } });
      }
      if (url.includes("/api/categories")) {
        return Promise.resolve({ data: { data: [] } });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<CafeMenu />);

    await waitFor(() => {
      expect(screen.getByText("Skyline Sips")).toBeInTheDocument();
      expect(screen.getByText("Rooftop dining")).toBeInTheDocument();
    });
  });
});
