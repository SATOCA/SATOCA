type surveyIdTuple = {
  surveyId: string;
  uniqueSurveyId: string;
};

export default function validateSurveyId(
  surveyId: string,
  uniqueSurveyId: string
): boolean {
  const validIds: surveyIdTuple[] = [
    { surveyId: "init-survey", uniqueSurveyId: "42-3-4" },
    { surveyId: "init-survey", uniqueSurveyId: "äasdökfökg" },
    { surveyId: "init-survey", uniqueSurveyId: "3456789-astÄ" },
    { surveyId: "test-survey", uniqueSurveyId: "79685421" },
    { surveyId: "test-survey", uniqueSurveyId: "123545" },
    { surveyId: "test-survey", uniqueSurveyId: "42" },
    { surveyId: "surveyfoo", uniqueSurveyId: "bar" },
    { surveyId: "surveyfoo", uniqueSurveyId: "foobar" },
  ];

  return validIds.some(
    (tuple) =>
      tuple.surveyId === surveyId && tuple.uniqueSurveyId === uniqueSurveyId
  );
}
