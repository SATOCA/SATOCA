import { Item } from "../DataModel/Item";

class SubmitAnswerService {

  static saveSubmittedAnswer(
    item: Item,
    submittedOptions: Array<number>
  ): void {
    localStorage.setItem(item.question.text, submittedOptions.toString());
  }

  static showSavedAnswers(): void {
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
  return SubmitAnswerService.saveSubmittedAnswer(item, submittedOptions);
}

export function showSavedAnswers() {
  return SubmitAnswerService.showSavedAnswers();
}

export { SubmitAnswerService };
