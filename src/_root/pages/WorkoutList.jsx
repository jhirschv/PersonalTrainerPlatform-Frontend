import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { useTheme } from '@/components/theme-provider';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from "@/components/ui/separator"
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPlus, faWandMagicSparkles} from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { PacmanLoader } from 'react-spinners';

const Workouts = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    const [workouts, setWorkouts] = useState(null)
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        apiClient.get('/user_workouts/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setWorkouts(response.data);
            console.log(response.data)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [])
    const ClickWorkout = (workoutId) => {
        navigate(`/workout/${workoutId}`);// Navigate to program details page
    }
    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
      };
    const createAiWorkout = () => {
        setIsLoading(true)
        apiClient.post(`/api/openai/`, { prompt: prompt })
            .then(response => {
                console.log(response)
                navigate(`/workout/${response.data.id}`);
                })
            
            .catch(error => console.error('Error:', error))
            .finally(() => {
        setIsLoading(false); // Stop loading on completion
      });
    }

    return (
        <div className={`w-full ${backgroundColorClass} border rounded-lg p-4 `}>
            
            <Card className='h-full w-full relative'>
            {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-25 z-10 rounded-lg">
                <PacmanLoader color="hsla(257, 70%, 40%, 1)" size={40} />
                </div>
            )}
                <div>
                    <div className='flex justify-between items-center'>
                        <div className='px-6 pt-6 pb-2'>
                            <h1 className='text-2xl font-semibold '>Workouts</h1>
                            <p className='text-sm text-muted-foreground'>Create workouts here</p>
                        </div>
                    <div className='flex flex-col md:flex-row  gap-2 md:gap-1'>
                        <AlertDialog>
                            <AlertDialogTrigger asChild className='mr-4 mt-4 md:mt-0'>
                                <Button variant="default" className='flex gap-1 items-center'><FontAwesomeIcon icon={faWandMagicSparkles} />AI Workout</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Create AI Workout</AlertDialogTitle>
                                <AlertDialogDescription>You have {remainingAIWorkouts} AI workouts left this week.</AlertDialogDescription>
                                <Label htmlFor="prompt">Workout Description</Label><Textarea value={prompt} onChange={handlePromptChange} placeholder="Describe your workout here." id='prompt' />
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={createAiWorkout}>Create<FontAwesomeIcon className='ml-1' icon={faWandMagicSparkles} /></AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild className='mr-4'>
                                <Button variant="outline" className='flex gap-1 items-center'><FontAwesomeIcon size='sm'icon={faPlus} />New Workout</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Create Program</AlertDialogTitle>
                                <Label htmlFor="programName">Name</Label><Input autoComplete="off" id="programName" />
                                <Label htmlFor="description">Description</Label><Input autoComplete="off" id="description" />
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    </div>
                    <div className='flex flex-col w-full px-4 pb-4'>
                        <div className='flex items-center justify-end pb-2 space-x-2 w-full'>
                            <Label className='hidden md:block' htmlFor="sort">Sort by:</Label>

                            <Select className='self-end focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-none focus-visible:ring-offset-0' id='sort'>
                                <SelectTrigger className="hidden md:flex w-[180px]">
                                    <SelectValue placeholder="Recently Updated" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recentlyUpdated">Recently Updated</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className='hidden md:block'>Descritpion</TableHead>
                            <TableHead>Creator</TableHead>
                        </TableRow>
                        </TableHeader>
                        
                        <TableBody className="overflow-y-auto">
                        {workouts && workouts.map((workout) => (
                            <TableRow onClick={() => ClickWorkout(workout.id)} key={workout.id} className='relative'>
                            <TableCell key={workout.name}>{workout.name}</TableCell>
                            <TableCell className="hidden md:block font-medium p-6">{workout.description}</TableCell>
                            <TableCell>{workout.creator.username[0].toUpperCase() + workout.creator.username.slice(1)}
                            <div className='hidden md:block absolute top-0 right-4'>
                                <Popover>
                                    <PopoverTrigger className='p-4'><FontAwesomeIcon size='lg' icon={faEllipsis} /></PopoverTrigger>
                                    <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md' >
                                        <Button className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>Delete Program</Button></PopoverContent>
                                </Popover>
                            </div> 
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>

                        
                        
                    </Table>
                    </div>

                    </div>
                </div>
                
            </Card>
        </div>
    )
}

export default Workouts