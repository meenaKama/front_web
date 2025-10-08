import React from 'react'
import Image from 'next/image'


const Inscription = () => {
  return (
    <main className="flex flex-col items-center bg-blue-300 w-full overflow-hidden min-h-dvh">
      <div className="flex flex-col items-center justify-center p-2 w-full">
        <div className="relative h-[150] w-[150px] rounded-full overflow-hidden">
          <Image
            src="/assets/logo/meena.png"
            alt="Meena Logo"
            fill
            className="object-contain"

          />
        </div>


      </div>
    </main>
  )
}

export default Inscription
