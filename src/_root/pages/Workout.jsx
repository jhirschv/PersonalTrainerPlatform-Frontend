import React from 'react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faArrowLeft, faXmark, faAngleLeft, faCircleChevronLeft, faPenToSquare, faEllipsis, faFileVideo } from '@fortawesome/free-solid-svg-icons';
  import { faCircleLeft, faSquarePlus } from '@fortawesome/free-regular-svg-icons';

  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Search } from "lucide-react"
  import { useNavigate } from 'react-router-dom';
  import Axios from 'axios';
  import { Button } from "@/components/ui/button"
  import { useTheme } from '@/components/theme-provider';
  import { Textarea } from "@/components/ui/textarea"
  import { Label } from "@/components/ui/label"
  import { useRef } from 'react';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Create = () => {

    const { workoutId } = useParams();
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    const [workout, setWorkout] = useState()
    const [workoutExercises, setWorkoutExercises] = useState([])
    const [exercises, setExercises] = useState([]);
    const [visibleTextareas, setVisibleTextareas] = useState({});
    const [editMode, setEditMode] = useState(true)
    const [newExercise, setNewExercise] = useState("")
    const [urlInputs, setUrlInputs] = useState({});

    useEffect(() => {
        apiClient.get(`/workouts/${workoutId}/`)
            .then(response => {
                setWorkout(response.data)
                setWorkoutExercises(response.data.workout_exercises)
                console.log(response.data)
                })
            
            .catch(error => console.error('Error:', error));
    }, [workoutId])
    
    const fetchWorkoutExercises = () => {
        apiClient.get(`/workouts/${workoutId}/`)
            .then(response => {
                setWorkoutExercises(response.data.workout_exercises)
                console.log(response.data.workout_exercises)
                })
            
            .catch(error => console.error('Error:', error))
    }
    const deleteWorkoutExercise = (exercise) => {
        apiClient.delete(`/workout_exercises/${exercise}/`)
            .then(response => {
                console.log(response)
                fetchWorkoutExercises()
            })

        .catch(error => console.log('Error', error))
    }
    const handleUrlInputChange = (id, value) => {
        setUrlInputs(prevInputs => ({
            ...prevInputs,
            [id]: value
        }));
    }
    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
        fileInputRef.current.click(); // Trigger hidden file input click event
    }
    const handleVideoChange = (exerciseId, file) => {
        const formData = new FormData();
        formData.append('video', file);

        apiClient.patch(`/workout_exercises/${exerciseId}/`, formData)
            .then(response => {
                console.log(response)
            })

        .catch(error => console.log('Error', error))
    }
    const handleUrl = (exerciseId, url) => {

        const extractVideoID = (url) => {
            const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\/\?]+)/;
            const matches = url.match(regex);
            return matches ? matches[1] : null;
        };
    
        const videoID = extractVideoID(url);
    
        if (videoID) {

        apiClient.patch(`/exercises/${exerciseId}/`, {video: videoID})
            .then(response => {
                console.log(response)
                fetchWorkoutExercises()

            })

        .catch(error => console.log('Error', error))
    }
    }
    let createNewExercise = () => {

        if (newExercise.trim()) {
            apiClient.post('/exercises/', { name: newExercise })
            .then(response => {
                console.log(response)
                setNewExercise("");
                fetchExercises()
            })

            .catch(error => console.log('Error', error))
        }
    }
    const handleSetsChange = (exerciseId, newSets) => {
        const updatedExercises = workoutExercises.map(exerciseDetail => {
          if (exerciseDetail.exercise.id === exerciseId) {
            return { ...exerciseDetail, sets: newSets };
          }
          return exerciseDetail;
        });
        setWorkoutExercises(updatedExercises);
    }
    const handleRepsChange = (exerciseId, newReps) => {
        const updatedExercises = workoutExercises.map(exerciseDetail => {
          if (exerciseDetail.exercise.id === exerciseId) {
            return { ...exerciseDetail, reps: newReps };
          }
          return exerciseDetail;
        });
        setWorkoutExercises(updatedExercises);
    }
    const handleNoteChange = (exerciseId, note) => {
        const updatedExercises = workoutExercises.map(exerciseDetail => {
          if (exerciseDetail.exercise.id === exerciseId) {
            return { ...exerciseDetail, note: note };
          }
          return exerciseDetail;
        });
        setWorkoutExercises(updatedExercises);
    }
    function updateWorkout() {
        const workoutData = {
            id: workoutId,
            workout_exercises: workoutExercises.map(({id, exercise, sets, reps, note, video}) => ({
                id,
                workout: workoutId,
                exercise_name: exercise.name, 
                sets,
                reps,
                note,
                video,
            })),
            name: workout.name,
            phase: phase.id
        }
        apiClient.put(`/workouts/${workoutId}/`, workoutData) 
        .then(response => {
            console.log('Workout updated successfully:', response.data);
        })
        .catch(error => {
            console.error('Failed to update workout:', error);
        });
    }
    const fetchExercises = () => {
        Axios.get('http://localhost:8000/exercises/').then((res) => {
          setExercises(res.data)
      })  
    }
      useEffect(() => {
        fetchExercises()
    }, [])
    const clickToAddExercise = (exerciseToAdd) => {

        const isAlreadyIncluded = workoutExercises.some(
            (exerciseDetail) => exerciseDetail.exercise.id === exerciseToAdd.id
        );
        if (!isAlreadyIncluded) {
            const newExerciseDetail = {
                exercise: exerciseToAdd,
                sets: "", 
                reps: "", 
                note: "",
                video: null,
                workout: workoutId, 
            };

        setWorkoutExercises([...workoutExercises, newExerciseDetail]);
        console.log(workoutExercises)
        } else {
            console.log("already included");
        }
    }
    let navigate = useNavigate();
    function goBack() {
        navigate(-1);
    }
    let workoutExerciseList = workoutExercises.map(exerciseDetail => {
        const { id, exercise, sets, reps, note } = exerciseDetail;
        return (
            <Card key={exercise.id} className='relative mt-1 mb-1 mx-2 md:mr-3'> 
            {editMode ? 
            <div className='absolute top-1 right-3'>
                <Popover>
                    <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                    <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                    <Button onClick={() => deleteWorkoutExercise(id)} className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>Delete Exercise</Button>
                    </PopoverContent>
                </Popover>
            </div> : <></>}
            {editMode ?
            <CardContent className="p-0 h-20 py-4 pl-2 pr-4 flex justify-between items-center">
                {exercise.video ? 
                <div className='h-16 w-16 hidden md:block'>
                    <Popover>
                        <PopoverTrigger>
                        <img
                            src={`https://img.youtube.com/vi/${exercise.video}/maxresdefault.jpg`}
                            alt="Video Thumbnail"
                            className="object-cover rounded-md cursor-pointer w-16 h-16"
                        />
                        </PopoverTrigger>
                        <PopoverContent className='flex justify-center items-center fixed inset-0 z-50 m-auto w-[580px] h-[350px]'>
                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${exercise.video}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                        </PopoverContent>
                    </Popover>
                </div> :
                <div className='hidden md:flex justify-center items-center h-16 w-16'>
                <Popover>
                    <PopoverTrigger>
                        <FontAwesomeIcon size='2xl' icon={faSquarePlus} />
                    </PopoverTrigger>
                    <PopoverContent className='flex items-center w-[auto]'>
                        <Label className='mr-2'>url:</Label>
                        <Input value={urlInputs[exercise.id] || ''} onChange={(e) => handleUrlInputChange(exercise.id, e.target.value)}
                        className='h-8 rounded-r-none w-48 focus:outline-none focus:ring-0 ' placeholder="Youtube URL"/>
                        <Button onClick={() => handleUrl(exercise.id, urlInputs[exercise.id])} variant='outline' className='h-8 mr-2 rounded-l-none'>Upload</Button>
                    </PopoverContent>
                </Popover>
                </div> 
                }
                <p className='w-1/4 ml-2 md:text-md font-semibold'>{exercise.name}</p>

                 
                <div className='flex items-center md:ml-10'>
                <Select  value={sets > 0 ? sets.toString() : ''}
                onValueChange={(newValue) => handleSetsChange(exercise.id, parseInt(newValue, 10))}
                id={`sets-${exercise.id}`}>
                    <SelectTrigger className="w-[55px] md:w-[80px] focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder='sets' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>sets</SelectLabel>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="11">11</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="13">13</SelectItem>
                            <SelectItem value="14">14</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="17">17</SelectItem>
                            <SelectItem value="18">18</SelectItem>
                            <SelectItem value="19">19</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FontAwesomeIcon className='m-3' icon={faXmark} />
                <Select value={reps > 0 ? reps.toString() : ''}
                 onValueChange={(newValue) => handleRepsChange(exercise.id, parseInt(newValue, 10))}
                 id={`reps-${exercise.id}`}>
                    <SelectTrigger className="w-[50px] md:w-[80px] focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder={`${reps? reps : 'reps'}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>sets</SelectLabel>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="9">9</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="11">11</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="13">13</SelectItem>
                            <SelectItem value="14">14</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="17">17</SelectItem>
                            <SelectItem value="18">18</SelectItem>
                            <SelectItem value="19">19</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select> 
                </div>     
                 
                <div className='flex flex-col'>
                    <FontAwesomeIcon onClick={() => {setVisibleTextareas(prev => ({...prev, [exercise.id]: !prev[exercise.id]}))}} size='md' icon={faPenToSquare} />
                    <p className='text-xs mt-1'>Add Note</p>
                </div> 
                        
            </CardContent>
            : 
            <CardContent className="h-20 py-4 flex items-center">
                <p className='w-1/4 font-semibold'>{exercise.name}</p>
                <div className='self-center flex items-center ml-36'>
                    <p className='text-lg font-semibold'>{sets}  x  {reps}</p>
                </div>
                
            </CardContent>
            }   
            <CardFooter className='p-0'>
                {visibleTextareas[exercise.id] && 
                <div className='w-full mb-2 mx-6'>
                    <Label>Note</Label><Textarea value={note} onChange={(e)  => handleNoteChange(exercise.id, e.target.value)} className='min-h-[20px] h-10 overflow-y-auto resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0' spellCheck="false"/>
                </div>}
            </CardFooter>                     
        </Card>
    )})

    return (
        <div className={`w-full flex ${backgroundColorClass} md:border rounded-lg md:p-4`}>
            <div className='w-full md:w-3/5'>
                
                <Card className='border-0 md:border md:mr-4 h-full flex flex-col'>
                    <CardHeader className='flex flex-row items=center justify-between'>
                        <div>
                        {workout ? (
                            <>
                                <CardTitle className='font-semibold'>{workout.name}  <FontAwesomeIcon onClick={()=> setEditMode(currentState => !currentState)} className='ml-1' size='xs' icon={faPenToSquare} /></CardTitle>
                            </>
                        ) : (
                            <p>Loading...</p> // Placeholder content or a loader can be placed here
                        )}
                        </div>
                        <FontAwesomeIcon onClick={goBack} size="xl" icon={faAngleLeft} />
                        
                    </CardHeader>
                    <CardContent className='px-6'>
                        <ScrollArea className="h-96 w-full rounded-md">
                            <div>
                                {workoutExerciseList.length > 0 ? workoutExerciseList : <div className=' flex justify-center items-center w-full h-96 text-muted-foreground font-semibold text-xl'>
                                    <h1 className='text-muted-foreground font-semibold text-xl'>No Exercises</h1></div>}
                            </div>
                        </ScrollArea>
                        {editMode ? <Button onClick={() => updateWorkout()} className='mt-6'>Save Changes</Button>: <> </>}
                   </CardContent>
                </Card>
            </div>
            {editMode ? 
            <div className='hidden lg:flex flex-1 flex-col'>
                <Card className='mb-2'>
                    <CardHeader className='pt-4 pb-0 px-4 '>
                        <CardTitle className='text-lg'>
                            Create New Exercise
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='flex gap-1 px-4 py-3'>
                        <Input value={newExercise} onChange={(event) => setNewExercise(event.target.value)} placeholder="Exercise name" className="py-4" />
                        <Button onClick={() => createNewExercise()}variant="outline">Create</Button>
                    </CardContent>
                </Card>
                
                
                    <Tabs defaultValue='exerciseDatabase'>
                        <div className='flex justify-center items-center w-full pb-2'>
                        <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xs bg-muted">
                            <TabsTrigger className='rounded-xs' value="exerciseDatabase">Exercise Database</TabsTrigger>
                            <TabsTrigger className='rounded-xs' value="yourExercises">Your Exercises</TabsTrigger>
                        </TabsList>
                        </div>
                        <Card>
                        <div className="relative py-2 w-full flex justify-center items-center">
                            <Search className="absolute left-4 top-5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-8 w-full mx-2" />
                        </div>
                        <TabsContent className='m-0' value="exerciseDatabase">
                            <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                <div className="p-4">
                                    {exercises.map((exercise)=> {
                                        return (
                                            <div onClick={() => clickToAddExercise(exercise)} key={exercise.name}>
                                                <div className="text-sm">{exercise.name}</div>
                                                <Separator className="my-2" />
                                            </div>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent className='m-0' value="yourExercises">
                            <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                    <div className="p-4">
                                        
                                    </div>
                                </ScrollArea>
                        </TabsContent>
                        </Card>
                    </Tabs>
            </div>
            : <></> }
            
        </div>
  )
}

export default Create