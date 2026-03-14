package com.demeter.backend.users.service;

import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.users.model.Staff;
import com.demeter.backend.users.model.Student;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityManager entityManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       EntityManager entityManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.entityManager = entityManager;
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    @Transactional
    public User createStaff(String username, String password, Integer cafeteriaId) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("STAFF");
        User saved = userRepository.save(user);

        Staff staff = new Staff(saved, cafeteriaId);
        entityManager.persist(staff);

        return saved;
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        userRepository.delete(user);
    }
}
