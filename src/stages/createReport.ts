import { context } from '@actions/github';

import { getReportTag } from '../constants/getReportTag';
import { getTestRunSummary } from '../format/annotations/getTestRunSummary';
import { formatCoverage } from '../format/formatCoverage';
import { formatErrors } from '../format/formatErrors';
import { formatRunReport } from '../format/formatRunReport';
import { getFailureDetails } from '../format/getFormattedFailures';
import { testsFail, testsSuccess } from '../format/strings.json';
import template from '../format/template.md';
import { JsonReport } from '../typings/JsonReport';
import { SummaryReport } from '../typings/Report';
import { TestRunReport } from '../typings/Report';
import { DataCollector } from '../utils/DataCollector';
import { i18n } from '../utils/i18n';
import { insertArgs } from '../utils/insertArgs';

export const createReport = (
    dataCollector: DataCollector<JsonReport>,
    workingDirectory?: string,
    customTitle?: string
): SummaryReport => {
    const { errors, data } = dataCollector.get();
    const [headReport, baseReport] = data;
    const formattedErrors = formatErrors(errors);

    const coverage = formatCoverage(headReport, baseReport, undefined);
    const runReport: TestRunReport = {
        title: headReport.success ? testsSuccess : testsFail,
        summary: getTestRunSummary(headReport),
        failures: getFailureDetails(headReport),
    };
    const formattedReport = formatRunReport(runReport);
    return {
        text: insertArgs(template, {
            body: [formattedErrors, coverage, formattedReport].join('\n'),
            dir: workingDirectory || '',
            tag: getReportTag(workingDirectory),
            title: insertArgs(customTitle || i18n('summaryTitle'), {
                dir: workingDirectory ? `for \`${workingDirectory}\`` : '',
            }),
            sha:
                context.payload.after ??
                context.payload.pull_request?.head.sha ??
                context.sha,
        }),
        runReport,
    };
};
