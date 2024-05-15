import React from 'react'
import { useTheme } from '@/components/theme-provider';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Separator } from '@/components/ui/separator';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Moon, Sun } from "lucide-react"
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient'; 


const Account = () => {
    const { setTheme } = useTheme()
    const { theme } = useTheme();
    let { user, logoutUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleDeleteAccount = async () => {
        try {
            const response = await apiClient.delete('/delete-account/');  // Adjust URL as needed
            if (response.status === 204) {  // 204 No Content, standard response for successful DELETE request
                alert("Account successfully deleted.");
                navigate('/login');  // Redirect to login page
            }
        } catch (error) {
            console.error("Failed to delete account:", error);
            alert("There was a problem deleting your account.");
        }
    }
    
    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`w-full ${backgroundColorClass} md:border rounded-lg md:p-4`}>
            <Card className='border-0 md:border h-full w-full rounded-none md:rounded-lg'>
                    <div className='p-6 flex justify-between items-center'>
                        <div className='w-full'>
                            <div className='flex justify-between'>
                                <h1 className='text-2xl font-semibold '>Account</h1>
                                <FontAwesomeIcon icon={faRightFromBracket} onClick={logoutUser} className='md:block ml-4 md:mr-2' size="xl"/>
                            </div>
                            
                            <p className='text-sm text-muted-foreground'>Manage your account settings here</p>
                            <Separator className="my-6"/>
                            <div className='flex flex-col gap-6'>

                                <div className='flex items-center gap-8'>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col justify-center font-semibold text-sm'>
                                        <p>{user.username}</p>
                                        <p className='text-primary underline-offset-4 hover:underline'>Change profile photo</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button className='md:flex ml-auto' variant="outline" size="icon">
                                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                            <span className="sr-only">Toggle theme</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setTheme("light")}>
                                            Light
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                                            Dark
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("system")}>
                                            System
                                        </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                </div>

                                {/* <div>
                                    <Label>Username</Label>
                                    <Input className='md:w-96 rounded-xs mt-1' placeholder="Username"></Input>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input className='md:w-96 rounded-xs mt-1' placeholder="Email"></Input>
                                </div> */}
                                
                                
                                <div className='flex gap-2'>
                                    {/* <Button className='rounded-xs w-30 '>Update Account</Button> */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className='rounded-xs w-30 h-[41px]' variant="outline">Delete Account</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your
                                                account and remove your data from our servers.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <Button variant='destructive' onClick={handleDeleteAccount}>Delete</Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                            
                        </div>
                    </div>
            
            </Card>
        </div>
    )
}

export default Account