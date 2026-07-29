import { DonorDashboard } from "@components/dashboards/DonorDashboard";
import { VolunteerDashboard } from "@components/dashboards/VolunteerDashboard";
import { RecipientDashboard } from "@components/dashboards/RecipientDashboard";
import { NgoDashboard } from "@components/dashboards/NgoDashboard";
import { ActivityChooser } from "@components/ActivityChooser";
import { useUserStore } from "@store/useUserStore";

/**
 * The Home tab. New users register as a normal user and first see the activity
 * chooser (Donate / Volunteer / Inform a Place). Once they pick, the matching
 * dashboard is shown. Volunteering can be as an NGO/committee or an individual.
 */
export default function HomeScreen() {
  const role = useUserStore((s) => s.user.role);
  const activityChosen = useUserStore((s) => s.activityChosen);

  if (!activityChosen) {
    return <ActivityChooser />;
  }

  switch (role) {
    case "volunteer":
      return <VolunteerDashboard />;
    case "recipient":
      return <RecipientDashboard />;
    case "ngo":
      return <NgoDashboard />;
    case "donor":
    default:
      return <DonorDashboard />;
  }
}
