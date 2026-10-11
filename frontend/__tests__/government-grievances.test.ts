import { useGrievanceStore, INITIAL_DEMO_GRIEVANCES, DEMO_OFFICERS_LIST } from "../store/grievance-store";
import en from "../locales/en.json";
import te from "../locales/te.json";
import hi from "../locales/hi.json";

describe("Government Farmer Grievances Store and Workflows", () => {
  beforeEach(() => {
    useGrievanceStore.getState().resetGrievances();
  });

  test("loads initial demo grievance tickets", () => {
    const { tickets } = useGrievanceStore.getState();
    expect(tickets.length).toBeGreaterThan(0);
    expect(tickets.some((t) => t.priority === "Critical")).toBe(true);
    expect(tickets.some((t) => t.status === "Awaiting Field Assignment")).toBe(true);
    expect(tickets.some((t) => t.status === "In Progress")).toBe(true);
    expect(tickets.some((t) => t.status === "Resolved")).toBe(true);
  });

  test("assigns an officer and updates ticket status", () => {
    const ticket = useGrievanceStore
      .getState()
      .tickets.find((t) => t.status === "Awaiting Field Assignment" || t.status === "Open");
    expect(ticket).toBeDefined();

    if (ticket) {
      const officer = DEMO_OFFICERS_LIST[0];
      useGrievanceStore.getState().assignOfficer(ticket.id, officer, "Priority field visit required.");

      const updated = useGrievanceStore.getState().tickets.find((t) => t.id === ticket.id);
      expect(updated?.assignedOfficer).toBe(officer);
      expect(updated?.status).toBe("Assigned");
      expect(updated?.timeline.some((ev) => ev.title === "Officer Assigned")).toBe(true);
    }
  });

  test("starts investigation on an assigned ticket", () => {
    const ticket = useGrievanceStore.getState().tickets.find((t) => t.status === "Assigned");
    expect(ticket).toBeDefined();

    if (ticket) {
      useGrievanceStore.getState().startInvestigation(ticket.id, "Site survey underway.");
      const updated = useGrievanceStore.getState().tickets.find((t) => t.id === ticket.id);
      expect(updated?.status).toBe("In Progress");
      expect(updated?.timeline.some((ev) => ev.title === "Investigation Started")).toBe(true);
    }
  });

  test("requests farmer information with non-empty reason", () => {
    const ticket = useGrievanceStore.getState().tickets[0];
    const reason = "Please upload bank passbook first page with branch IFSC.";

    useGrievanceStore.getState().requestFarmerInfo(ticket.id, reason);
    const updated = useGrievanceStore.getState().tickets.find((t) => t.id === ticket.id);
    expect(updated?.status).toBe("Awaiting Farmer Information");
    expect(updated?.infoRequestReason).toBe(reason);
    expect(updated?.timeline.some((ev) => ev.title === "Farmer Information Requested")).toBe(true);
  });

  test("resolves a ticket with resolution summary", () => {
    const ticket = useGrievanceStore.getState().tickets[1];
    const summary = "Canal bund breached section repaired using sandbags. Normal water flow restored.";

    useGrievanceStore.getState().resolveTicket(ticket.id, summary);
    const updated = useGrievanceStore.getState().tickets.find((t) => t.id === ticket.id);
    expect(updated?.status).toBe("Resolved");
    expect(updated?.resolutionNotes).toBe(summary);
    expect(updated?.timeline.some((ev) => ev.title === "Ticket Resolved")).toBe(true);
  });

  test("closes and reopens a resolved ticket", () => {
    const ticket = useGrievanceStore.getState().tickets.find((t) => t.status === "Resolved");
    expect(ticket).toBeDefined();

    if (ticket) {
      useGrievanceStore.getState().closeTicket(ticket.id, "Case closed after farmer verification.");
      let updated = useGrievanceStore.getState().tickets.find((t) => t.id === ticket.id);
      expect(updated?.status).toBe("Closed");

      useGrievanceStore.getState().reopenTicket(ticket.id, "Farmer reported recurring leakage.");
      updated = useGrievanceStore.getState().tickets.find((t) => t.id === ticket.id);
      expect(updated?.status).toBe("In Progress");
      expect(updated?.timeline.some((ev) => ev.title === "Ticket Reopened")).toBe(true);
    }
  });

  test("changes ticket priority including Critical escalation", () => {
    const ticket = useGrievanceStore.getState().tickets.find((t) => t.priority === "Normal");
    expect(ticket).toBeDefined();

    if (ticket) {
      useGrievanceStore.getState().changePriority(ticket.id, "Critical", "Urgent escalation requested.");
      const updated = useGrievanceStore.getState().tickets.find((t) => t.id === ticket.id);
      expect(updated?.priority).toBe("Critical");
      expect(updated?.timeline.some((ev) => ev.title === "Priority Changed to Critical")).toBe(true);
    }
  });

  test("translation key parity across en, te, and hi for govtGrievances", () => {
    const enKeys = Object.keys(en.govtGrievances).sort();
    const teKeys = Object.keys(te.govtGrievances).sort();
    const hiKeys = Object.keys(hi.govtGrievances).sort();

    expect(teKeys).toEqual(enKeys);
    expect(hiKeys).toEqual(enKeys);
  });
});
