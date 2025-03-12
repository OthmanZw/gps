using UnityEngine;
using System.Collections.Generic;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    // État du jeu
    public int CurrentLevel { get; private set; }
    public int TotalScore { get; private set; }
    public bool IsGamePaused { get; private set; }

    // Événements du jeu
    public delegate void GameStateChanged();
    public event GameStateChanged OnGamePaused;
    public event GameStateChanged OnGameResumed;
    public event GameStateChanged OnLevelCompleted;

    private void Awake()
    {
        // Singleton pattern
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }

        InitializeGame();
    }

    private void InitializeGame()
    {
        CurrentLevel = 1;
        TotalScore = 0;
        IsGamePaused = false;
        LoadGameData();
    }

    public void PauseGame()
    {
        IsGamePaused = true;
        Time.timeScale = 0;
        OnGamePaused?.Invoke();
    }

    public void ResumeGame()
    {
        IsGamePaused = false;
        Time.timeScale = 1;
        OnGameResumed?.Invoke();
    }

    public void CompleteLevel(int score)
    {
        TotalScore += score;
        CurrentLevel++;
        SaveGameData();
        OnLevelCompleted?.Invoke();
    }

    private void LoadGameData()
    {
        // TODO: Implémenter le chargement des données sauvegardées
        CurrentLevel = PlayerPrefs.GetInt("CurrentLevel", 1);
        TotalScore = PlayerPrefs.GetInt("TotalScore", 0);
    }

    private void SaveGameData()
    {
        // TODO: Implémenter la sauvegarde des données
        PlayerPrefs.SetInt("CurrentLevel", CurrentLevel);
        PlayerPrefs.SetInt("TotalScore", TotalScore);
        PlayerPrefs.Save();
    }
} 