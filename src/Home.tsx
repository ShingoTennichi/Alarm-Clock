import { useEffect, useState, useRef} from 'react';
import styles from './Home.module.css';
import alarm from './components/alarm';
import zeroFill from './components/zeroFill';
import PublishToTopic from './AWS/SNSPublishToTopic-v3';
import { PublishCommandInput } from '@aws-sdk/client-sns';
// const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]




const Home = ():JSX.Element => {
    let initialDate: Date = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [input, setInput] = useState<string[]>(["", ""]);
    const [timerStatus, setTimerStatus] = useState<boolean>(false);
    const time = useRef(`${zeroFill(initialDate.getHours())} : ${zeroFill(initialDate.getMinutes())} : ${zeroFill(initialDate.getSeconds())}`);
    const date = useRef(`${initialDate.getFullYear()} / ${initialDate.getMonth()+1} / ${initialDate.getDate()}`)
    const audio: HTMLAudioElement = new Audio('/audio/alarm-sound.wav');
    useEffect(() => {
        console.log("object");
        setTimeout(()=>{
            setCurrentDate(new Date());
            date.current = `${currentDate.getFullYear()} / ${currentDate.getMonth()+1} / ${currentDate.getDate()}`
            time.current = `${zeroFill(currentDate.getHours())} : ${zeroFill(currentDate.getMinutes())} : ${zeroFill(currentDate.getSeconds())}`;
            if(alarm(timerStatus, input, currentDate.getHours(), currentDate.getMinutes())) {
                audio.play();
                setTimerStatus(false);
            }
        },1000);
    }, [currentDate, input, timerStatus])

    function setTimer() {
        if(!timerStatus) {
            const params: PublishCommandInput = {
                TopicArn: 'arn:aws:sns:us-east-2:237600839617:clock-project',
                Subject: "alarm clock",
                Message:
                    `\nMessage: timer was set at ${input[0]} : ${input[1]}`
            };
            PublishToTopic(params);
        } else {
            const params: PublishCommandInput = {
                TopicArn: 'arn:aws:sns:us-east-2:237600839617:clock-project',
                Subject: "alarm clock",
                Message:
                    `\nMessage: timer was unset`
            };
            PublishToTopic(params);
        }
        setTimerStatus(!timerStatus);
    }
    return(
        <>
            <div className={styles.container}>
                <h1>Timer</h1>
                <div className={`${styles.frame} ${styles.clock}`}>
                    <span className={styles.time}>{time.current}</span>
                    <span className={styles.date}>{date.current}</span>
                </div>
                <input type="time" className={styles.timer} onChange={(e) => setInput(e.target.value.split(":"))}/>
                <button className={styles.btn} onClick={() => setTimer()}>set</button>
                <span className={styles.message}>{timerStatus ? "Timer is on": "Timer is off"}</span>
            </div>
        </>
    )
}

export default Home;