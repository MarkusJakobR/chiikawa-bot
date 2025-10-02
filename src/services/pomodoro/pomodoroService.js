import { buildStartTimer, buildBreakTimer } from "./messages.js";
// const STUDY_MINUTES = 0.05;
// const BREAK_MINUTES = 5;

const activePomodoro = {};

function calculateEndTime(minutes) {
  const now = new Date();
  const endTime = new Date(now.getTime() + minutes * 60000);

  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return endTime.toLocaleTimeString([], options);
}

async function startTimer(interaction, studyMinutes, breakMinutes) {
  const channelId = interaction.channelId;
  const channel = await interaction.client.channels.fetch(channelId);

  const displayName =
    interaction.member?.displayName ||
    interaction.user.username ||
    interaction.user.tag;

  const timer = {
    studentId: interaction.user.id,
    displayName,
    timerId: interaction.id,
    currCycle: 0,
    studyMinutes,
    breakMinutes,
    endTime: calculateEndTime(studyMinutes),
  };

  const startEmbed = buildStartTimer(timer, "#F5D2D2", "pomodoroStart");

  await channel.send({
    content: `Good luck, <@${timer.studentId}>!`,
    embeds: [startEmbed],
  });

  activePomodoro[channelId] = timer;

  await new Promise((res) => setTimeout(res, timer.studyMinutes * 60000));

  const breakEmbed = buildBreakTimer(timer, "#F5D2D2", "pomodoroBreak");

  await channel.send({
    content: `Good job! Take a short ${timer.breakMinutes}-minute break, <@${timer.studentId}>!`,
    embeds: [breakEmbed],
  });

  return;
}

export { startTimer };
