import { buildStartTimer, buildBreakTimer, buildEndTimer } from "./messages.js";
// const STUDY_MINUTES = 0.05;
// const BREAK_MINUTES = 5;

const activePomodoro = {};

function calculateEndTime(minutes) {
  const now = new Date();
  const endTime = new Date(now.getTime() + minutes * 60000);

  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return endTime.toLocaleTimeString([], options);
}

function startSession(timer, interaction) {
  const channel = interaction.channel;
  if (timer.currCycle < timer.cycles) {
    timer.currCycle++;
    timer.endTime = calculateEndTime(timer.studyMinutes);
    timer.startEmbed = buildStartTimer(timer, "#F5D2D2", "pomodoroStart");

    channel.send({
      content: `Study well, <@${timer.studentId}>!`,
      embeds: [timer.startEmbed],
    });

    timer.timeoutId = setTimeout(() => {
      if (timer.currCycle < timer.cycles) {
        timer.endTime = calculateEndTime(timer.breakMinutes);
        timer.breakEmbed = buildBreakTimer(timer, "#F5D2D2", "pomodoroBreak");

        channel.send({
          content: `Break time! Take a short ${timer.breakMinutes}-minute break, <@${timer.studentId}>!`,
          embeds: [timer.breakEmbed],
        });
        timer.timeoutId = setTimeout(() => {
          startSession(interaction, timer);
        }, timer.breakMinutes * 60000);
      } else {
        timer.endEmbed = buildEndTimer(timer, "F5D2D2", "pomodoroEnd");

        channel.send({
          content: `Congratulations <@${timer.studentId}> for completing your study session!`,
          embeds: [timer.endEmbed],
        });

        delete activePomodoro[timer.timerId];
      }
    }, timer.studyMinutes * 60000);
  }
}

async function startTimer(interaction, studyMinutes, breakMinutes, cycles) {
  const timerId = interaction.channelId + interaction.user.id;

  if (activePomodoro[timerId]) {
    return interaction.editReply({
      content: "You already have an active session in this channel",
      ephemeral: true,
    });
  }
  const displayName =
    interaction.member?.displayName ||
    interaction.user.username ||
    interaction.user.tag;

  const timer = {
    studentId: interaction.user.id,
    displayName,
    timerId,
    currCycle: 0,
    cycles,
    studyMinutes,
    breakMinutes,
    endTime: null,
    startEmbed: null,
    breakEmbed: null,
    endEmbed: null,
    timeoutId: null,
  };

  activePomodoro[timerId] = timer;

  startSession(timer, interaction);
}

export { startTimer };
