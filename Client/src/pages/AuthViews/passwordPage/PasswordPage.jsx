import { useState, useEffect } from "react";
import { EmailForm } from "./components/EmailForm";
import { EmailSentNotification } from "./components/EmailSentNotification";
import { useSearchParams } from "react-router-dom";
import { ChangePassword } from "./components/ChangePassword";

export const PasswordPage = () => {
    const [step, setStep] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [searchParams] = useSearchParams()
    const email = searchParams.get("email")
    

    const handleEmailSent = () => {
        setStep(2);
    };

    const handleReEmailSent = () => {
        setStep(1);
    };

    
    const saveTimeNow = () => {
        localStorage.setItem("lastRequestTime", Date.now());
    }


    //Useeffect para el tiempo en que se hizo la última solicitud
    useEffect(() => {
        const lastRequestTime = localStorage.getItem("lastRequestTime");
        if (lastRequestTime) {
            const elapsedTime = Math.floor((Date.now() - lastRequestTime) / 1000);
            if (elapsedTime < 60) {
                setTimeLeft(60 - elapsedTime);
            } else {
                setTimeLeft(0);
            }
        }
    }, [step]);

        //Useeffect para actualizar el contador del tiempo restante
        useEffect(() => {
            if (timeLeft > 0) {
                const interval = setInterval(() => {
                    setTimeLeft(prevTime => prevTime > 1 ? prevTime - 1 : 0);
                }, 1000);
                return () => clearInterval(interval);
            }
        }, [timeLeft]);
        

    
    return (
        <>
            <div className="flex justify-center items-center h-screen bg-gray-200">
                { email ? (
                    <ChangePassword />
                ) :
                step === 1 ? (
                    <EmailForm handleEmailSent={handleEmailSent} saveTimeNow={saveTimeNow} timeLeft={timeLeft} />
                ) : step === 2 ?  (
                    <EmailSentNotification handleReEmailSent={handleReEmailSent} />
                ) : null}
            </div>
        </>
    );
};
