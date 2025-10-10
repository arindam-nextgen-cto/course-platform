import Image from 'next/image'
import anuj from '@/app/images/anuj-clone.png'

export default function Mockup() {
    return (
        <div className="device-mockup device-large mockup-frame relative float-anim animate-fade-up" aria-hidden>
            {/* gradient shadow behind the device */}
            <div className="mockup-gradient" />

            <div className="mockup-screen relative rounded-lg overflow-hidden">
                <Image
                    src={anuj}
                    alt="Course app mockup"
                    fill
                    className="mockup-image"
                    priority
                    sizes="(min-width: 1024px) 520px, 80vw"
                />
                <div className="mockup-mask" aria-hidden />
            </div>
        </div>
    )
}
