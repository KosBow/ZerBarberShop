using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace ZerBarberShop.Services.Security;

public class PasswordManager
{


    private static RandomNumberGenerator _randomNumberGenerator;
    private const int _iterationCount = 100000;
    private const int _saltSize = 16;
    private const int _subkeySize = 32;

    public PasswordManager()
    {
        _randomNumberGenerator = RandomNumberGenerator.Create();
    }
    public string HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("Password cannot be null or empty.");
        }

        byte[] salt = new byte[_saltSize];
        _randomNumberGenerator.GetBytes(salt);

        byte[] subkey = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: _iterationCount,
            numBytesRequested: _subkeySize
        );

        byte[] outputBytes = new byte[1 + sizeof(int) + salt.Length + subkey.Length];
        outputBytes[0] = 0x01;
        Buffer.BlockCopy(BitConverter.GetBytes(salt.Length), 0, outputBytes, 1, sizeof(int));
        Buffer.BlockCopy(salt, 0, outputBytes, 1 + sizeof(int), salt.Length);
        Buffer.BlockCopy(subkey, 0, outputBytes, 1 + sizeof(int) + salt.Length, subkey.Length);

        return Convert.ToBase64String(outputBytes);
    }
    public bool VerifyPassword(string hashedPassword, string passwordToVerify)
    {
        if (string.IsNullOrWhiteSpace(hashedPassword) || string.IsNullOrWhiteSpace(passwordToVerify))
        {
            throw new ArgumentException("Passwords cannot be null or empty.");
        }

        byte[] decodedBytes = Convert.FromBase64String(hashedPassword);

        if (decodedBytes[0] != 0x01)
        {
            throw new FormatException("Unknown password hashing version.");
        }

        int saltLength = BitConverter.ToInt32(decodedBytes, 1);

        byte[] salt = new byte[saltLength];
        Buffer.BlockCopy(decodedBytes, 1 + sizeof(int), salt, 0, salt.Length);


        int subkeyStartIndex = 1 + sizeof(int) + salt.Length;
        byte[] storedSubkey = new byte[decodedBytes.Length - subkeyStartIndex];
        Buffer.BlockCopy(decodedBytes, subkeyStartIndex, storedSubkey, 0, storedSubkey.Length);

        byte[] derivedSubkey = KeyDerivation.Pbkdf2(
            password: passwordToVerify,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: _iterationCount,
            numBytesRequested: _subkeySize
        );
        return CryptographicOperations.FixedTimeEquals(storedSubkey, derivedSubkey);
    }
}