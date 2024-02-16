import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  
import { Button } from "@/components/ui/button"
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';


export default function YourWorkouts() {
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    const [programName, setProgramName] = useState("");
    const [programDescription, setProgramDescription] = useState("");

    const handleNameInputChange = (event) => {
    setProgramName(event.target.value); // Update state with input value
        };
    const handleDescriptionInputChange = (event) => {
        setProgramDescription(event.target.value); // Update state with input value
        };
    const resetForm = () => {
        setProgramName('');
        setProgramDescription('');
        };

    function createProgram() {
        const programData = {
            name: programName, // Assuming your API expects a key called 'name'
            description: programDescription, // Assuming your API expects a key called 'description'
        };
    
        apiClient.post('/programs/', programData) // Pass programData as the payload in the POST request
        .then(response => {
            setPrograms(currentPrograms => [...currentPrograms, response.data]); // Update your state or context with the response
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        apiClient.get('/user_programs/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setPrograms(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const navigate = useNavigate();
    const handleProgramClick = (programId) => {
        navigate(`/programs/${programId}`); // Navigate to program details page
    };

    return (

        <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='h-full w-full'>
                <div>
                    <h1 className='text-center text-3xl font-bold p-6'>Programs</h1>
                    <div className='grid grid-cols-4 gap-4 w-full p-4' >
                    {programs.map(program => (
                        <div key={program.id} onClick={() => handleProgramClick(program.id)}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{program.name}</CardTitle>
                                    <CardDescription>{program.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                </CardContent>
                                <CardFooter>
                                    <p>Creator: {program.creator.username[0].toUpperCase() + program.creator.username.slice(1)}</p>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                    
                    </div>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger className='ml-4 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                        Create Program
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Create Program</AlertDialogTitle>
                        <Label htmlFor="programName">Name</Label><Input onChange={handleNameInputChange} value={programName} autoComplete="off" id="programName" />
                        <Label htmlFor="description">Description</Label><Input onChange={handleDescriptionInputChange} value={programDescription} autoComplete="off" id="description" />
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel onClick={resetForm}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={createProgram}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Card>
        </div>
        
        
    )
 
}
