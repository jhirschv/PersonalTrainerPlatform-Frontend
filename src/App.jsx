import Programs from './_root/pages/Programs';
import Train from './_root/pages/Train';
import PrivateRoute from './utils/PrivateRoute'
import useDisableZoom from './utils/useDisableZoom';
import CreateProgram from './_root/removedPages/CreateProgram';
import Clients from './_root/removedPages/Clients';
import Progress from './_root/pages/Progress';
import Chat from './_root/pages/Chat';
import Account from './_root/pages/Account';
import Workouts from './_root/pages/WorkoutList';
import SigninForm from './_auth/SigninForm';
import ExerciseLibrary from './_root/removedPages/ExerciseLibrary';
import RootLayout from './_root/RootLayout'
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "@/components/theme-provider"
import Edit from './_root/pages/Edit';
import ProgramDetails from './_root/removedPages/ProgramDetails';
import PhaseDetails from './_root/pages/WorkoutList';
import WorkoutDetails from './_root/removedPages/WorkoutDetails';
import ProgramOverview from './_root/pages/ProgramOverview';
import WorkoutSession from './_root/pages/WorkoutSession';
import Workout from './_root/pages/Workout'


function App() {
  useDisableZoom();
  

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route element={<PrivateRoute />}>
              <Route path="account" element={<Account />} />  
              <Route path="edit/:phaseId/:workoutId" element={<Edit />} />  
              <Route path='workout/:workoutId' element={<Workout />} />
              <Route path='programs' element={<Programs />} />       
              <Route path="workouts" element={<Workouts />} />       
              <Route path="/program_overview/:programId" element={<ProgramOverview />} />
              <Route index element={<Train />} />
              <Route path="/workoutSession/:sessionId" element={<WorkoutSession />} />
              <Route path="/Progress" element={<Progress />} />
              <Route path="/Chat" element={<Chat />} />
            </Route>
          </Route>
          <Route path="/login" element={<SigninForm />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App


{/* REMOVED ROUTES
<Route path="/programs/:programId" element={<ProgramDetails />} />
<Route path="/programs/phases/:phaseId" element={<PhaseDetails />} />
<Route path="/workout/:workoutId" element={<WorkoutDetails />} />
<Route path="/clients" element={<Clients />} />
<Route path="/exerciseLibrary" element={<ExerciseLibrary />} />
<Route path="/settings" element={<Settings />} /> */}