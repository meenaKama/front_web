import React from 'react'
import Image from 'next/image'
import SignUp from './components/SignUp'


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
            priority
            sizes='150px'

          />
        </div>

        <SignUp />
        <p className="text-center text-sm mt-2 relative -bottom-1/3">
          ⓒ Meena, Inc. Tous droits réservés.
        </p>
      </div>
    </main>
  )
}

export default Inscription
