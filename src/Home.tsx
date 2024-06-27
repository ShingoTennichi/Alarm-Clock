import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { PublishToTopic, subscribeEmail } from "./AWS/SNSPublishToTopic-v3";
import { PublishCommandInput } from "@aws-sdk/client-sns";

// const DAYS: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const INITIAL_DATE: Date = new Date();

const Home = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState<Date>(INITIAL_DATE);
  const [input, setInput] = useState<string[]>(["", ""]);
  const [timerStatus, setTimerStatus] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    setTimeout(() => {
      setCurrentDate(new Date());
      if (timerStatus && checkAlarm(input, currentDate)) {
        const audio: HTMLAudioElement = new Audio("/audio/alarm-sound.wav");
        audio.play();
        setTimerStatus(false);
      }
    }, 1000);
  }, [currentDate, timerStatus, input]);

  return (
    <div className={styles.container}>
      <h1>Timer</h1>
      <div className={`${styles.frame} ${styles.clock}`}>
        <span className={styles.time}>{displayTime(currentDate)}</span>
        <span className={styles.date}>{displayDate(currentDate)}</span>
      </div>
      <input
        type="time"
        className={styles.timer}
        onChange={(e) => setInput(e.target.value.split(":"))}
      />
      <button
        className={styles.btn}
        onClick={() => setTimer(timerStatus, setTimerStatus, input)}
      >
        set
      </button>
      <span className={styles.message}>
        {timerStatus ? "Timer is on" : "Timer is off"}
      </span>
      <div className={styles.subscribe}>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <button
          className={styles.btn}
          onClick={async () => await subscribeEmail(email)}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Home;

function displayDate(date: Date): string {
  return `${date.getFullYear()} / ${date.getMonth() + 1} / ${date.getDate()}`;
}

function displayTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const mins = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${hours} : ${mins} : ${seconds}`;
}

async function setTimer(
  timerStatus: boolean,
  setTimerStatus: Function,
  input: string[]
) {
  const message = timerStatus
    ? `\nMessage: timer was unset`
    : `\nMessage: timer was set at ${input[0]} : ${input[1]}`;
  const params: PublishCommandInput = {
    TopicArn: "arn:aws:sns:us-east-2:237600839617:clock-project",
    Subject: "alarm clock",
    Message: message,
  };
  try {
    await PublishToTopic(params);
  } catch (error) {
    throw new Error("" + error);
  }
  console.log("done");
  setTimerStatus(!timerStatus);
}

function checkAlarm(input: string[], date: Date): boolean {
  const hour = date.getHours();
  const min = date.getMinutes();

  return parseInt(input[0]) === hour && parseInt(input[1]) === min;
}
