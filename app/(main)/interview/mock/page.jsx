import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Quiz from '../_components/quiz'

function MockInterviewPage() {
  return (
    <div>
        <div className=' flex flex-col space-y-2 mx-2' >
            <Link href={"/interview"} >
            <Button variant="link" className="gap-2 pl-0" >
                <ArrowLeft className=' h-4 w-4' />
                Go back
            </Button>
            </Link>
            <div className=' px-2' >
                <h1 className=' text-6xl font-bold gradient-title' >Mock Interview</h1>
                <p className=' text-muted-foreground' >
                    Test your knowledge
                </p>
            </div>
            <Quiz/>
        </div>
    </div>
  )
}

export default MockInterviewPage