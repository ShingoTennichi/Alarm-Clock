export default function checkAlarm(status: boolean ,userInput: string[], hour: number, min: number): boolean {
    if(status) {
        if(Number(userInput[0]) === hour && Number(userInput[1]) === min) return true;
    }
    return false;
}