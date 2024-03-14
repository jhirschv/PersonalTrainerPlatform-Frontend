import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { ScrollArea } from "@/components/ui/scroll-area"
  import { Calendar } from "@/components/ui/calendar"
  import { Button } from "@/components/ui/button"
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableFooter,
    TableRow,
    } from "@/components/ui/table"
    import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
      } from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

const Train = () => {
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
    const navigate = useNavigate();

    const [date, setDate] = React.useState(new Date())
    const [activeProgram, setActiveProgram] = useState(null)
    const [selectedProgram, setSelectedProgram] = useState(null)
    const [userPrograms, setUserPrograms] = useState([])
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [phasesDetails, setPhasesDetails] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [userWorkoutSessions, setUserWorkoutSessions] = useState([])
    const [dayData, setDayData] = useState({});
    const [displayCurrentWorkout, setDisplayCurrentWorkout] = useState(true);

    const handleDayData = (dayData) => {
        console.log('Sending event data to parent:', dayData)
        setDayData(dayData)
        if (Object.keys(dayData).length > 0) {
            setDisplayCurrentWorkout(false); // Display dayData if there's data for the clicked day
        } else {
            setDisplayCurrentWorkout(true); // Fallback to current workout display
        }
    }

    const handleSelect = (newDate) => {
      setDate(newDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      // Create a new Date object from newDate and strip time for comparison
      const selectedDate = new Date(newDate);
      selectedDate.setHours(0, 0, 0, 0);
    
      // Compare dates to check if the selected date is today
      if (selectedDate.getTime() === today.getTime()) {
        setDisplayCurrentWorkout(true);
      } else {
        setDisplayCurrentWorkout(false);
      }
    };

    function updateActiveProgram(selectedProgram) {
            const payload = {
                program_id: selectedProgram, 
            };

            apiClient.post('/set_active_program/', payload)
            .then(response => {
                return apiClient.get('/get_active_program/'); 
            })
            .then(response => {
                setActiveProgram(response.data);
                return apiClient.get('/current_workout/');
            })
            .then(response => {
                setCurrentWorkout(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setCurrentWorkout(null)
        });
        
    }
    const startWorkoutSession = () => {
        const payload = {
            workout_id: currentWorkout.id, 
        };

        apiClient.post('/start_workout_session/', payload)
            .then(response => {
                console.log(response.data);
                navigate(`/workoutSession/${response.data.session_id}`);
            })
            .catch(error => {
                console.error('Error starting workout session:', error);
            });
    }
    const handleProgramClick = (programId) => {
        setSelectedProgram(programId)
    }
    const updateWorkoutProgress = async (selectedWorkout) => {
        try {
            const response = await apiClient.post('/update_workout_progress/', {
                phase_id: selectedWorkout.phaseId,
                week_number: selectedWorkout.week,
                workout_id: selectedWorkout.workoutId
            });
    
            // Check if the update was successful
            if (response.status === 200) {
                // Re-fetch the current workout to update the UI
                fetchCurrentWorkout();
            }
        } catch (error) {
            console.error('Failed to update workout progress:', error);
            // Handle error appropriately
        }
    }
    function handleSelectedWorkout(data) {
        setSelectedWorkout(data)
        console.log(data)
    }
    const fetchCurrentWorkout = () => {
        apiClient.get('/current_workout/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setCurrentWorkout(response.data);
            setDisplayCurrentWorkout(true);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
    const handleSheetOpenChange = (open) => {
        setIsSheetOpen(open);

        // If the Sheet is being closed (open is false), reset selectedWorkout
        if (!open) {
            setSelectedWorkout(null);
        }
    }

    useEffect(() => {
        apiClient.get('/user_workout_sessions/')
            .then(response => {
                setUserWorkoutSessions(response.data)
                })
            
            .catch(error => console.error('Error:', error));
        }, []);

    useEffect(() => {
        if (activeProgram) { // Check if activeProgram is not null
            const fetchData = async () => {
                try {
                    const programId = activeProgram.id; // Assuming activeProgram contains an id field
                    const response = await apiClient.get(`phase_details/${programId}/`);
                    setPhasesDetails(response.data);
                } catch (error) {
                    console.error('Error fetching phases and workouts:', error);
                }
            };
            fetchData();
        }
    }, [activeProgram]);
     // This effect depends on programId   
    useEffect(() => {
        apiClient.get('/get_active_program/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setActiveProgram(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    useEffect(() => {
        fetchCurrentWorkout();
    }, [activeProgram]);

    useEffect(() => {
        apiClient.get('/user_programs/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setUserPrograms(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const renderWorkoutDetails = (workout) => {
        return (
            <>
                <div className='flex items-center justify-between pr-2'>
                    <h1 className='font-semibold text-lg'>{workout.name}</h1>
                    <div>
                        <Popover>
                            <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                            <PopoverContent>Place content for the popover here.</PopoverContent>
                        </Popover>
                    </div>
                </div>

                <Table className='h-full'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] pl-0">Exercise</TableHead>
                            <TableHead>Sets x Reps</TableHead>
                            <TableHead>Note</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workout.workout_exercises.map((exercise) => (
                            <TableRow key={exercise.id}>
                                <TableCell className="font-medium w-36 pl-0">{exercise.exercise.name}</TableCell>
                                <TableCell>{`${exercise.sets} x ${exercise.reps}`}</TableCell>
                                <TableCell>{exercise.note || ''}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>
        );
    };

    const renderWorkoutSessionDetails = (workout) => {

        const workoutDate = new Date(workout.date);

        // Format the date
        const formattedDate = workoutDate.toLocaleDateString('en-US', {
            year: 'numeric', // "2024"
            month: 'long', // "March"
            day: 'numeric', // "8"
        });
        
        return (
        <>
                <div className='flex items-center justify-between pr-2'>
                    <h1 className='font-semibold text-lg'>{workout.workout.name}</h1>
                    <h1>{formattedDate}</h1>
                    <h1>Completed: {workout.completed.toString()}</h1>
                
                </div>
            </>
        )
    }
   

    return (
        <div className={`${backgroundColorClass} w-full p-4 border rounded-lg`}>
            <Card className='h-full w-full flex flex-col'>
                <div className='flex h-full'>

                    <div className='flex flex-col h-full justify-between basis-2/5 pl-6'>
                        <div className='flex flex-col pr-2 py-6'>
                            <div className='flex mb-4'>
                                {activeProgram? <h1 className='mr-2 text-2xl font-semibold'>{activeProgram.name}</h1> : <h1 className='mr-2 text-2xl font-semibold'>No Active Program</h1>}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline">Change Program</Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                        <SheetTitle>Select Program</SheetTitle>
                                        </SheetHeader>
                                        {userPrograms.map((program) => (
                                        <div
                                            key={program.id}
                                            className={`p-4 rounded ${selectedProgram === program.id ? 'bg-secondary' : 'bg-background'}`}
                                            onClick={() => handleProgramClick(program.id)}
                                        >
                                            <h1>{program.name}</h1>
                                        </div>
                                        ))}
                                        <SheetFooter className='mt-4'>
                                        <SheetClose asChild>
                                            <Button type="submit" onClick={() => updateActiveProgram(selectedProgram)}>Save changes</Button>
                                        </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </div>
                            
                            <div>
                                {displayCurrentWorkout && currentWorkout ? renderWorkoutDetails(currentWorkout) :
                                !displayCurrentWorkout && dayData ? renderWorkoutSessionDetails(dayData) :
                                <h1>No Workout Selected</h1>}
                            </div>
                            
                        </div>
                        
                        <div className='mb-6'>
                            <Button onClick={startWorkoutSession} className='self-center w-1/2 p-6 text-lg'>Start Training!</Button>
                            <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
                                <SheetTrigger asChild>
                                    <Button variant='outline' onClick={() => setIsSheetOpen(true)} className='mx-2 self-center w-1/3 mb-4 p-6 text-lg'>Change Workout</Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <div className='w-full flex justify-center'>
                                        <Button onClick={() => { updateWorkoutProgress(selectedWorkout); setIsSheetOpen(false); }}  disabled={!selectedWorkout} className='self-center w-1/2 p-6 text-lg'>Save</Button>
                                    </div>
                                    <ScrollArea className="h-full w-full">
                                    <div>
                                        {/* Render phases, weeks, and workouts based on the fetched data */}
                                        {phasesDetails.map((phase) => (
                                            <div key={phase.id}>
                                            <h3 className='font-bold text-center p-2'>{phase.name}</h3>
                                            {phase.workouts_by_week.map((week, index) => (
                                                <div key={index}>
                                                <h4 className='font-semibold text-center p-2'>Week {week.week}</h4>
                                                {week.workouts.map((workout) => (
                                                    <p  onClick={() => handleSelectedWorkout({ phaseId: phase.id, week: week.week, workoutId: workout.id, workoutName: workout.name })}
                                                    className={`ml-4 p-4 border mr-4 ${selectedWorkout?.workoutId === workout.id && selectedWorkout?.week === week.week ? 'bg-secondary' : 'bg-background'}`} key={workout.id}>{workout.name}
                                                    </p>
                                                ))}
                                                </div>
                                            ))}
                                            </div>
                                        ))}
                                        </div>
                                    </ScrollArea>
                                </SheetContent>
                             </Sheet>
                        </div>
                        
                    </div>

                    <div className='flex h-full items-center justify-center basis-3/5'>
                        <Calendar
                        onDataReceive={handleDayData}
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        className="h-[90%] m-4"
                        />
                    </div>
                    

                    
                    
                </div>
            </Card>
        </div>
    )
}

export default Train