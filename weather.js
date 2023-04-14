#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { getWeather, getIcon } from './services/api.service.js';
import { printHelp, printSuccess, printError, printWeather } from './services/log.service.js';
import { saveKeyValue, TOKEN_DICTIONARY, getKeyValue } from './services/storage.service.js';

const saveToken = async (token) => {
    if (!token.length) {
        printError('Не указан токен');
        return;
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token);
        printSuccess('Токен успешно сохранен');
    } catch (err) {
        printError(err.message);
    }
};

const saveCity = async (city) => {
    if (!city.length) {
        printError('Не указан город');
        return;
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city);
        printSuccess('Город успешно сохранен');
    } catch (err) {
        printError(err.message);
    }
};

const getForcast = async () => {
    try {
        const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city);
        const weather = await getWeather(city);
        printWeather(weather, getIcon(weather.weather[0].icon));
    } catch (err) {
        if (err?.response?.status === 404) {
            printError('Неверно указан город');
        } else if (err?.response?.status === 401) {
            printError('Неверно указан токен');
        } else {
            printError(err.message);
        }
    }
};

const initCLI = () => {
    const args = getArgs(process.argv);
    if (args.h) {
        return printHelp();
    }
    if (args.s) {
        return saveCity(args.s);
    }
    if (args.t) {
        return saveToken(args.t);
    }
    return getForcast();
};

initCLI();