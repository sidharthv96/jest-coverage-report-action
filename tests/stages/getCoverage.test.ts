import { exec } from '@actions/exec';
import { readFile, rmdir } from 'fs-extra';

import { getCoverage } from '../../src/stages/getCoverage';
import { JsonReport } from '../../src/typings/JsonReport';
import { Options } from '../../src/typings/Options';
import { createDataCollector } from '../../src/utils/DataCollector';

const defaultOptions: Options = {
    token: '',
    testScript: 'default script',
    iconType: 'emoji',
    annotations: 'all',
    packageManager: 'npm',
    skipStep: 'none',
};

const clearMocks = () => {
    (exec as jest.Mock<any, any>).mockClear();
    (rmdir as jest.Mock<any, any>).mockClear();
    (readFile as jest.Mock<any, any>).mockClear();
};

beforeEach(clearMocks);

describe('getCoverage', () => {
    it('should run all steps', async () => {
        const dataCollector = createDataCollector<JsonReport>();

        (readFile as jest.Mock<any, any>).mockImplementationOnce(() => '{}');

        const jsonReport = await getCoverage(
            dataCollector,
            defaultOptions,
            false,
            false
        );

        expect(rmdir).toBeCalledWith('node_modules', { recursive: true });
        expect(exec).toBeCalledWith('npm install', undefined, {
            cwd: undefined,
        });
        expect(exec).toBeCalledWith('default script', [], { cwd: undefined });
        expect(readFile).toHaveBeenCalledWith('report.json');

        expect(jsonReport).toStrictEqual({});
    });

    it('should skip installation step', async () => {
        const dataCollector = createDataCollector<JsonReport>();

        (readFile as jest.Mock<any, any>).mockImplementationOnce(() => '{}');

        const jsonReport = await getCoverage(
            dataCollector,
            { ...defaultOptions, skipStep: 'install' },
            false,
            false
        );

        expect(rmdir).not.toBeCalledWith('node_modules', { recursive: true });
        expect(exec).not.toBeCalledWith('npm install', undefined, {
            cwd: undefined,
        });
        expect(exec).toBeCalledWith('default script', [], { cwd: undefined });
        expect(readFile).toHaveBeenCalledWith('report.json');

        expect(jsonReport).toStrictEqual({});
    });

    it('should skip all steps', async () => {
        const dataCollector = createDataCollector<JsonReport>();

        (readFile as jest.Mock<any, any>).mockImplementationOnce(() => '{}');

        const jsonReport = await getCoverage(
            dataCollector,
            { ...defaultOptions, skipStep: 'all' },
            false,
            false
        );

        expect(rmdir).not.toBeCalledWith('node_modules', { recursive: true });
        expect(exec).not.toBeCalledWith('npm install', undefined, {
            cwd: undefined,
        });
        expect(exec).not.toBeCalledWith('default script', [], {
            cwd: undefined,
        });
        expect(readFile).toHaveBeenCalledWith('report.json');

        expect(jsonReport).toStrictEqual({});
    });

    it('should run all steps, ignoring skip-step option', async () => {
        const dataCollector = createDataCollector<JsonReport>();

        (readFile as jest.Mock<any, any>).mockImplementationOnce(() => '{}');

        const jsonReport = await getCoverage(
            dataCollector,
            { ...defaultOptions, skipStep: 'all' },
            true,
            false
        );

        expect(rmdir).toBeCalledWith('node_modules', { recursive: true });
        expect(exec).toBeCalledWith('npm install', undefined, {
            cwd: undefined,
        });
        expect(exec).toBeCalledWith('default script', [], {
            cwd: undefined,
        });
        expect(readFile).toHaveBeenCalledWith('report.json');

        expect(jsonReport).toStrictEqual({});
    });

    it('should run all steps, ignoring skip-step option', async () => {
        const dataCollector = createDataCollector<JsonReport>();

        (readFile as jest.Mock<any, any>).mockImplementationOnce(() => '{}');

        const jsonReport = await getCoverage(
            dataCollector,
            { ...defaultOptions, skipStep: 'all' },
            true,
            false
        );

        expect(rmdir).toBeCalledWith('node_modules', { recursive: true });
        expect(exec).toBeCalledWith('npm install', undefined, {
            cwd: undefined,
        });
        expect(exec).toBeCalledWith('default script', [], {
            cwd: undefined,
        });
        expect(readFile).toHaveBeenCalledWith('report.json');

        expect(jsonReport).toStrictEqual({});
    });
});
