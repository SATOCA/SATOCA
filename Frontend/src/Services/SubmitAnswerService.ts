import { Item } from "../DataModel/Item";

class SubmitAnswerService {
  saveSubmittedAnswer(item: Item, submittedOptions: Array<number>): void {
    localStorage.setItem(item.question.text, submittedOptions.toString());
  }

  showSavedAnswers(): void {
    for (let i = 0; i < localStorage.length; i++) {
      console.log(
          "Saved all: ",
          localStorage.key(i),
          localStorage.getItem(localStorage.key(i) as string)
      );
    }
  }
}

export function saveSubmittedAnswer(
  item: Item,
  submittedOptions: Array<number>
) {
  const submitAnswerService = new SubmitAnswerService();
  return submitAnswerService.saveSubmittedAnswer(item, submittedOptions);
}

export function showSavedAnswers() {
  const submitAnswerService = new SubmitAnswerService();
  return submitAnswerService.showSavedAnswers();
}

export { SubmitAnswerService };
