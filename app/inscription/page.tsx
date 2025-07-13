import React from 'react'
import Image from 'next/image'

const Inscription = () => {
  return (
      <main className="flex flex-col items-center min-h-screen bg-blue-300 w-full">
            {/* Partie mobile */}
                <div className="flex lg:hidden flex-col items-center justify-center p-4">
                  <div className="relative h-[150px] w-[150px] rounded-full overflow-hidden">
                    <Image
                      src="/assets/logo/meena.png"
                      alt="Meena Logo"
                      fill
                      className="object-contain"
          
                    />
                  </div>
                 
          
                </div>
          
                {/* Partie desktop */}
                <div className="hidden lg:block">
                  <h1 className="text-4xl font-bold">Meena desktop est en cours de production</h1>
                </div>
      
    </main>
  )
}

export default Inscription
