import StudentLayout from "./layouts/StudentLayout";
import StudentHome from "./student/StudentHome";

export default function App() {
  return (
    <StudentLayout>
      <StudentHome />
    </StudentLayout>
  );
}